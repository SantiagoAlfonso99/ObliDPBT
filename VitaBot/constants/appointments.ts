export type Appointment = {
  id: string;
  title: string;
  place: string;
  date: string;   // ISO o texto legible
  time: string;
  status: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
};

export const APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Mamografía',
    place: 'Clínica Central',
    date: '2025-06-25',
    time: '10:30',
    status: 'PENDIENTE',
  },
  {
    id: '2',
    title: 'Laboratorio de sangre',
    place: 'Laboratorio Norte',
    date: '2025-07-01',
    time: '08:00',
    status: 'CONFIRMADO',
  },
];