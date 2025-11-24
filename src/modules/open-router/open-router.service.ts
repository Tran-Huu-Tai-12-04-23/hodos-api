import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LocationEntity } from 'src/entities';
import { ChatMessagePart, CreateChatDto } from './dto';

@Injectable()
export class OpenRouterService {
  private client: OpenAI;

  constructor() {
    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      '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';
    const baseURL =
      process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required in env');
    }

    this.client = new OpenAI({
      apiKey,
      baseURL,
    } as any);
  }

  summarizeDetail(detail: string, maxLength = 512): string {
    if (!detail) return '';
    const sentences = detail
      .split('.')
      .filter(Boolean)
      .map((s) => s.trim());
    if (sentences.length >= 2) {
      return sentences.slice(0, 2).join('. ') + '.';
    }
    return detail.slice(0, maxLength);
  }

  buildEmbeddingText(location: LocationEntity): string {
    const summary = this.summarizeDetail(location?.detail || '');
    return `${location.name || ''}. ${location.description || ''}. ${summary}`.trim();
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const resp = await fetch('http://127.0.0.1:8000/embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentences: [text],
        }),
      });
      const data = await resp.json();
      const embedding = data?.embeddings?.[0];

      if (!embedding) throw new Error('No embedding returned');
      return embedding;
    } catch (err) {
      throw new Error(err?.message || 'Embedding creation failed');
    }
  }

  async createEmbeddingForLocation(
    location: LocationEntity,
  ): Promise<number[]> {
    const text = this.buildEmbeddingText(location);
    return await this.createEmbedding(text);
  }

  async chat(dto: CreateChatDto): Promise<{ raw: any; text: string | null }> {
    try {
      const model = dto.model || 'openai/gpt-3.5-turbo';
      const userMessage = {
        role: 'user',
        content: dto.content.map((part: ChatMessagePart) => {
          if (part.type === 'text') return { type: 'text', text: part.text };
          if (part.type === 'image_url')
            return { type: 'image_url', image_url: part.image_url };
          return part;
        }),
      } as any;

      const resp = await this.client.chat.completions.create({
        model,
        messages: [userMessage],
      } as any);

      const choice = resp?.choices?.[0];
      const message = choice?.message;
      return {
        raw: resp,
        text: message?.content || null,
      };
    } catch (err) {
      throw new Error(err?.message || 'Chat failed');
    }
  }
}
