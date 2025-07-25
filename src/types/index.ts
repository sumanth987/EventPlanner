export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  verified: boolean;
  rsvp: 'Accept' | 'Reject' | null;
  arrival?: Date;
  departure?: Date;
  travelMode?: string;
  travelNo?: string;
}

export interface Event {
  _id: string;
  noteType: 'Invitation' | 'Welcome' | 'Thank You';
  noteContent: string;
  showSchedule: boolean;
  showEvents: boolean;
  eventTitle: string;
  eventDescription: string;
  venue: string;
  lat: number;
  long: number;
}

export interface Guest {
  _id: string;
  userId: string;
  name: string;
  relation: string;
  phone?: string;
}

export interface Schedule {
  _id: string;
  title: string;
  dateTime: Date;
  venue: string;
  dressCode?: string;
}

export interface MiniEvent {
  _id: string;
  title: string;
  description: string;
  lat: number;
  long: number;
  type: 'info' | 'game';
  gameOptions?: string;
}

export interface Participation {
  _id: string;
  userId: string;
  miniEventId: string;
  status: 'Interested' | 'Not Interested';
  selectedGame?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}