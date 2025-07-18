// entities/action-log.entity.ts
import { Column, Entity } from 'typeorm';
import { BaseEntityCustom } from './base.entity';

@Entity('action_log')
export class ActionLog extends BaseEntityCustom {
  @Column()
  action: string; // CREATE, UPDATE, DELETE, REPO_CREATE, REPO_UPDATE, REPO_DELETE, REPO_READ

  @Column()
  entityName: string; // Name of the entity or table being operated on

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    before?: any; // Entity state before change
    after?: any; // Entity state after change
    query?: string; // SQL query for repository actions
    parameters?: any[]; // Query parameters for repository actions
    stack?: string; // Stack trace for repository actions
    [key: string]: any; // Other metadata
  };

  @Column({ nullable: true })
  performedBy?: string; // User ID from request context

  @Column({ nullable: true })
  ip?: string; // IP address from request context
}
