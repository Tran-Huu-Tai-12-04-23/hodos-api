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
}
