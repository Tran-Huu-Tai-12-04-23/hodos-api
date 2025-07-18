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

    // Extract only important data for logging
    const metadata = {
      // For before state, only keep primary key and timestamp fields
      before: this.extractImportantFields(event.databaseEntity),
      // For after state, keep more details but clean large values
      after: this.extractImportantFields(event.entity),
    };

    await logRepo.save({
      action,
      entityName: event.metadata?.targetName || '',
      metadata,
      performedBy: event.queryRunner.data?.user || null,
      ip: event.queryRunner.data?.ip || null,
    });
  }

  /**
   * Extract only important fields and clean large values
   */
  private extractImportantFields(entity: any): any {
    if (!entity) return null;

    const result: Record<string, any> = {};

    // Keep ID and timestamp fields
    const keysToKeep = [
      'id',
      'uuid',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'createdById',
      'updatedById',
    ];

    // For each property in the entity
    Object.keys(entity).forEach((key) => {
      // Skip TypeORM internal properties and functions
      if (key.startsWith('__') || typeof entity[key] === 'function') return;

      // Keep important keys
      if (keysToKeep.includes(key) || key.includes('Id')) {
        result[key] = entity[key];
      }
      // For large strings, truncate them
      else if (typeof entity[key] === 'string' && entity[key].length > 100) {
        result[key] = entity[key].substring(0, 100) + '...';
      }
      // For arrays or objects, just note their presence rather than deep copying
      else if (typeof entity[key] === 'object' && entity[key] !== null) {
        if (Array.isArray(entity[key])) {
          result[key] = `[Array: ${entity[key].length} items]`;
        } else if (entity[key] instanceof Date) {
          result[key] = entity[key];
        } else {
          result[key] = '[Object]';
        }
      }
      // Keep primitive values as is
      else {
        result[key] = entity[key];
      }
    });

    return result;
  }

  private shouldSkipQuery(query: string): boolean {
    // Skip all SELECT queries
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return true;
    }

    // Skip system queries like sequence updates, migrations, etc.
    const skippableQueries = [
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
      // First, quickly determine action type before doing more processing
      const action = this.determineQueryAction(event.query);

      // Only log CREATE, UPDATE, DELETE operations (not READ)
      if (!action) return;

      // Extract the entity type from the query
      const entityName = this.extractEntityName(event.query);
      if (!entityName) return;

      // Skip storing actual parameters, just count them

      const logRepo = event.queryRunner.manager.getRepository(ActionLog);
      await logRepo.save({
        action: `REPO_${action}`,
        entityName,
        metadata: {
          // Store just enough of the query to understand what happened
          query: this.truncateQuery(event.query),
          // Store minimal parameter info
          paramCount: event.parameters?.length || 0,
          // Store the calling function for context
          caller: new Error().stack?.split('\n')[3]?.trim() || '',
        },
        performedBy: event.queryRunner.data?.user || null,
        ip: event.queryRunner.data?.ip || null,
      });
    } catch (error) {
      // Don't crash if logging fails
      console.error('Failed to log repository action:', error);
    }
  }

  /**
   * Truncate query to prevent storing extremely large queries
   */
  private truncateQuery(query: string): string {
    const maxLength = 500;
    if (query.length <= maxLength) return query;
    return query.substring(0, maxLength) + '...';
  }

  /**
   * Clean parameters to prevent storing sensitive or large data
   */
  private cleanParameters(params: any[]): any[] {
    return params.map((param) => {
      // If parameter is an object, simplify it
      if (param && typeof param === 'object') {
        // If it's a Date, just return it as is
        if (param instanceof Date) return param;

        // For arrays, clean each element
        if (Array.isArray(param)) {
          return param.length > 10
            ? `Array with ${param.length} items`
            : param.map((p) => this.simplifyValue(p));
        }

        // For objects, return a simplified version with just the keys
        return `Object with keys: ${Object.keys(param).join(', ')}`;
      }

      // For string values, truncate if too long
      if (typeof param === 'string' && param.length > 100) {
        return param.substring(0, 100) + '...';
      }

      return param;
    });
  }

  /**
   * Simplify a value for storage in metadata
   */
  private simplifyValue(value: any): any {
    if (value === null || value === undefined) return value;

    if (typeof value === 'object') {
      if (value instanceof Date) return value;
      if (Array.isArray(value)) return '[Array]';
      return '[Object]';
    }

    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }

    return value;
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

    // Don't log SELECT queries
    return null;
  }
}
