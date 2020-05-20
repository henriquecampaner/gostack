import Appointment from '@modules/appointments/infra/typeorm/entities/Appoitment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import iFindAllInMothFromProviderDTO from '../dtos/iFindAllInMothFromProviderDTO';
import iFindAllInDayFromProviderDTO from '../dtos/iFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(data: Date): Promise<Appointment | undefined>;
  findAllInMothFromProvider(
    data: iFindAllInMothFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: iFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
