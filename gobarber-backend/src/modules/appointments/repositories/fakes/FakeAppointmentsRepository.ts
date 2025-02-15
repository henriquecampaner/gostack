import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import iCreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import iAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appoitment';
import iFindAllInMothFromProviderDTO from '../../dtos/iFindAllInMothFromProviderDTO';
import iFindAllInDayFromProviderDTO from '../../dtos/iFindAllInDayFromProviderDTO';

class AppointmentRepository implements iAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;
  }

  public async findAllInMothFromProvider({
    provider_id,
    month,
    year,
  }: iFindAllInMothFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: iFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: iCreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
