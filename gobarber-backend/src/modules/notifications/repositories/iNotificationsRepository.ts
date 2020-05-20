import iCreateNotificationDTO from '../dtos/iCreateNotificationDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
  create(data: iCreateNotificationDTO): Promise<Notification>;
}
