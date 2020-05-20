import { getMongoRepository, MongoRepository } from 'typeorm';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import iNotificationsRepository from '@modules/notifications/repositories/iNotificationsRepository';
import iCreateNotificationDTO from '@modules/notifications/dtos/iCreateNotificationDTO';

class NotificationRepository implements iNotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: iCreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });
    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationRepository;
