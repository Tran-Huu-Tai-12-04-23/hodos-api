// subscribers/action-log.subscriber.ts
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { ActionLog } from '../entities/action-log.entity';

@EventSubscriber()
export class ActionLogSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Object;
  }

  async afterInsert(event: InsertEvent<any>) {
    await this.saveLog('CREATE', event);
  }

  async afterUpdate(event: UpdateEvent<any>) {
    await this.saveLog('UPDATE', event);
  }

  async afterRemove(event: RemoveEvent<any>) {
    await this.saveLog('DELETE', event);
  }

  /**
   * This method is called before any query is executed by the query runner
   */
  async beforeQuery(event: {
    query: string;
    parameters?: any[];
    queryRunner: any;
  }) {
    // Log repository method calls
    if (!event.query || !event.queryRunner) return;

    // Only log meaningful operations, not system queries
    if (this.shouldSkipQuery(event.query)) return;

    await this.logRepositoryAction(event);
  }

  private async saveLog(action: 'CREATE' | 'UPDATE' | 'DELETE', event: any) {
    if (event.metadata?.target?.name === 'ActionLog') return;

    const logRepo = event.manager.getRepository(ActionLog);
    await logRepo.save({
      action,
      entityName: event.metadata?.targetName || '',
      metadata: {
        before: event.databaseEntity,
        after: event.entity,
      },
      performedBy: event.queryRunner.data?.user || null,
      ip: event.queryRunner.data?.ip || null,
    });
  }

  private shouldSkipQuery(query: string): boolean {
    // Skip system queries like sequence updates, migrations, etc.
    const skippableQueries = [
      'SELECT NOW()',
      'SELECT version()',
      'SELECT current_schema()',
      'SELECT EXISTS',
      'nextval(',
      '_prisma_migrations',
      'pg_catalog',
      'information_schema',
      'action_log', // Avoid infinite recursion by not logging action_log queries
    ];

    return skippableQueries.some((term) => query.includes(term));
  }

  private async logRepositoryAction(event: any) {
    try {
      // Extract the entity type from the query if possible
      const entityName = this.extractEntityName(event.query);
      if (!entityName) return;

      // Determine action type
      const action = this.determineQueryAction(event.query);
      if (!action) return;

      // Get parameters
      const parameters = event.parameters || [];

      const logRepo = event.queryRunner.manager.getRepository(ActionLog);
      await logRepo.save({
        action: `REPO_${action}`,
        entityName,
        metadata: {
          query: event.query,
          parameters,
          stack: new Error().stack?.split('\n').slice(3, 8).join('\n') || '',
        },
        performedBy: event.queryRunner.data?.user || null,
        ip: event.queryRunner.data?.ip || null,
      });
    } catch (error) {
      // Don't crash if logging fails
      console.error('Failed to log repository action:', error);
    }
  }

  private extractEntityName(query: string): string | null {
    // Try to extract table name from common query types
    const insertMatch = query.match(/INSERT INTO\s+"?([a-zA-Z0-9_]+)"?\s/i);
    const updateMatch = query.match(/UPDATE\s+"?([a-zA-Z0-9_]+)"?\s/i);
    const deleteMatch = query.match(/DELETE FROM\s+"?([a-zA-Z0-9_]+)"?\s/i);
    const selectMatch = query.match(/FROM\s+"?([a-zA-Z0-9_]+)"?\s/i);

    return (
      insertMatch?.[1] ||
      updateMatch?.[1] ||
      deleteMatch?.[1] ||
      selectMatch?.[1] ||
      null
    );
  }

  private determineQueryAction(query: string): string | null {
    const normalizedQuery = query.trim().toUpperCase();

    if (normalizedQuery.startsWith('INSERT')) return 'CREATE';
    if (normalizedQuery.startsWith('UPDATE')) return 'UPDATE';
    if (normalizedQuery.startsWith('DELETE')) return 'DELETE';
    if (normalizedQuery.startsWith('SELECT')) return 'READ';

    return null;
  }
}
