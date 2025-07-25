import { User, Event, Schedule, MiniEvent, Guest } from '../types';

export const mockUsers: User[] = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@event.com',
    phone: '+1234567890',
    isAdmin: true,
    verified: true,
    rsvp: 'Accept',
    arrival: new Date('2024-03-15'),
    departure: new Date('2024-03-17'),
    travelMode: 'Flight',
    travelNo: 'AI101'
  },
  {
    _id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567891',
    isAdmin: false,
    verified: true,
    rsvp: null,
  },
  {
    _id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567892',
    isAdmin: false,
    verified: false,
    rsvp: null,
  }
];

export const mockEvent: Event = {
  _id: '1',
  noteType: 'Welcome',
  noteContent: 'Welcome to our spectacular celebration! We are thrilled to have you join us for this unforgettable event. Please make sure to check the schedule and let us know about your travel arrangements.',
  showSchedule: true,
  showEvents: true,
  eventTitle: 'Spring Celebration 2024',
  eventDescription: 'A magical evening of celebration, music, and memories.',
  venue: 'Grand Ballroom, Luxury Hotel',
  lat: 40.7128,
  long: -74.0060
};

export const mockSchedule: Schedule[] = [
  {
    _id: '1',
    title: 'Welcome Reception',
    dateTime: new Date('2024-03-15T18:00:00'),
    venue: 'Hotel Lobby',
    dressCode: 'Smart Casual'
  },
  {
    _id: '2',
    title: 'Main Ceremony',
    dateTime: new Date('2024-03-16T16:00:00'),
    venue: 'Grand Ballroom',
    dressCode: 'Formal'
  },
  {
    _id: '3',
    title: 'After Party',
    dateTime: new Date('2024-03-16T21:00:00'),
    venue: 'Rooftop Terrace',
    dressCode: 'Party Attire'
  }
];

export const mockMiniEvents: MiniEvent[] = [
  {
    _id: '1',
    title: 'Photo Booth Corner',
    description: 'Capture memories with our themed photo booth!',
    lat: 40.7129,
    long: -74.0059,
    type: 'info'
  },
  {
    _id: '2',
    title: 'Interactive Games',
    description: 'Join us for fun activities and games!',
    lat: 40.7127,
    long: -74.0061,
    type: 'game',
    gameOptions: 'Trivia,Charades,Musical Chairs,Dance Off'
  }
];

export const mockGuests: Guest[] = [
  {
    _id: '1',
    userId: '2',
    name: 'Sarah Doe',
    relation: 'Spouse',
    phone: '+1234567893'
  },
  {
    _id: '2',
    userId: '2',
    name: 'Tommy Doe',
    relation: 'Child',
  }
];