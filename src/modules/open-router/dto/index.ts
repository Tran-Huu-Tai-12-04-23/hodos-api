export class CreateEmbeddingDto {
  text: string;
}

// -----------------------------------------------------------------------------
// file: src/openrouter/dto/chat.dto.ts
// -----------------------------------------------------------------------------
export class ChatMessagePart {
  type: 'text' | 'image_url' | 'file' | string;
  text?: string;
  image_url?: { url: string };
}

export class CreateChatDto {
  // follow the shape user used: content: [{ type: 'text', text: '...' }, { type: 'image_url', image_url: { url: '...' } }]
  content: ChatMessagePart[];
  model?: string;
}
