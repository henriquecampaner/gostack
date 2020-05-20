import { getRepository, Repository, Raw } from 'typeorm';

import iCreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import iAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appoitment';
import iFindAllInMothFromProviderDTO from '@modules/appointments/dtos/iFindAllInMothFromProviderDTO';
import iFindAllInDayFromProviderDTO from '@modules/appointments/dtos/iFindAllInDayFromProviderDTO';

class AppointmentRepository implements iAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findAllInMothFromProvider({
    provider_id,
    month,
    year,
  }: iFindAllInMothFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: iFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppoitment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppoitment;
  }

  public async create({
    date,
    user_id,
    provider_id,
  }: iCreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });
    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
