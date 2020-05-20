import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import iCacheProvider from '@shared/container/providers/CachProvider/models/iCacheProvider';
import iAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import iNotificationsRepository from '@modules/notifications/repositories/iNotificationsRepository';

import AppError from '@shared/error/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appoitment';

interface IRequestDTO {
  user_id: string;
  date: Date;
  provider_id: string;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: iAppointmentRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: iNotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: iCacheProvider,
  ) {}

  public async execute({
    user_id,
    provider_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You cannot create an appointment on a past date');
    }

    if (user_id === provider_id) {
      throw new AppError('You cannot create an appointment with yourself');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only appointments between 8am and 5pm');
    }

    const findAppoitmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppoitmentInSameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(date, "dd-MM-yyyy 'at' HH:mm");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `New appointment for ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
