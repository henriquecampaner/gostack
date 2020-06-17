import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { isToday, format, isTomorrow, parseISO, isAfter } from 'date-fns';
import gb from 'date-fns/locale/en-GB';

import logoImg from '../../assets/logo.svg';
// Auth
import { useAuth } from '../../hooks/Auth';
// Api
import api from '../../services/api';

// Styles
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appoinment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedData, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appoinment[]>([]);
  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => setMonthAvailability(response.data));
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appoinment[]>(`/appointments/me`, {
        params: {
          year: selectedData.getFullYear(),
          month: selectedData.getMonth() + 1,
          day: selectedData.getDate(),
        },
      })
      .then(response => {
        const appontmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });
        setAppointments(appontmentsFormatted);
      });
  }, [selectedData]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedData, "dd'th' MMMM", { locale: gb });
  }, [selectedData]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedData, 'cccc', {
      locale: gb,
    });
  }, [selectedData]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Gobarber" />

          <Profile>
            <img
              src={
                user.avatar_url ||
                'https://api.adorable.io/avatars/400/abott@adorable.io.png'
              }
              alt={user.name}
            />

            <div>
              <span>Welcome</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Appoinments</h1>
          <p>
            {isToday(selectedData) && <span>Today</span>}
            {isTomorrow(selectedData) && <span>Tomorrow</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedData) && nextAppointment && (
            <NextAppointment>
              <strong>Next Appointment</strong>
              <div>
                <img
                  src={
                    nextAppointment.user.avatar_url ||
                    'https://api.adorable.io/avatars/400/abott@adorable.io.png'
                  }
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Morning</strong>

            {morningAppointments.length === 0 && (
              <p>You do not have appointments this morning</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={
                      appointment.user.avatar_url ||
                      'https://api.adorable.io/avatars/400/abott@adorable.io.png'
                    }
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Afternoon</strong>
            {afternoonAppointments.length === 0 && (
              <p>You do not have appointments this morning</p>
            )}
            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={
                      appointment.user.avatar_url ||
                      'https://api.adorable.io/avatars/400/abott@adorable.io.png'
                    }
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5, 6] },
            }}
            onDayClick={handleDateChange}
            selectedDays={selectedData}
            onMonthChange={handleMonthChange}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
