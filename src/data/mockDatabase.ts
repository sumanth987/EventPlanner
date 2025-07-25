// Mock database for browser-based demo
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
  createdAt: Date;
}

export interface Event {
  _id: string;
  noteType: 'Welcome' | 'Important' | 'Update';
  noteContent: string;
  showSchedule: boolean;
  showEvents: boolean;
  eventTitle: string;
  eventDescription: string;
  venue: string;
  lat: number;
  long: number;
}

export interface Schedule {
  _id: string;
  title: string;
  dateTime: Date;
  venue: string;
  dressCode: string;
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

export interface Guest {
  _id: string;
  userId: string;
  name: string;
  relation: string;
  phone?: string;
}

export interface Participation {
  _id: string;
  userId: string;
  miniEventId: string;
  status: 'Interested' | 'Not Interested';
  selectedGame?: string;
}

// Mock data storage
let users: User[] = [
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
    travelNo: 'AI101',
    createdAt: new Date()
  },
  {
    _id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567891',
    isAdmin: false,
    verified: true,
    rsvp: null,
    createdAt: new Date()
  },
  {
    _id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567892',
    isAdmin: false,
    verified: false,
    rsvp: null,
    createdAt: new Date()
  },
  {
    _id: '4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1234567893',
    isAdmin: false,
    verified: true,
    rsvp: 'Accept',
    arrival: new Date('2024-03-14'),
    departure: new Date('2024-03-18'),
    travelMode: 'Car',
    travelNo: 'Self Drive',
    createdAt: new Date()
  },
  {
    _id: '5',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1234567894',
    isAdmin: false,
    verified: true,
    rsvp: 'Reject',
    createdAt: new Date()
  }
];

let event: Event = {
  _id: 'event1',
  noteType: 'Welcome',
  noteContent: 'Welcome to our spectacular Spring Celebration 2024! We are thrilled to have you join us for this unforgettable event. Please make sure to check the schedule and let us know about your travel arrangements. This will be an amazing celebration with music, food, and memories that will last a lifetime.',
  showSchedule: true,
  showEvents: true,
  eventTitle: 'Spring Celebration 2024',
  eventDescription: 'A magical evening of celebration, music, and memories under the stars.',
  venue: 'Grand Ballroom, Luxury Hotel',
  lat: 40.7128,
  long: -74.0060
};

let schedules: Schedule[] = [
  {
    _id: 'schedule1',
    title: 'Welcome Reception',
    dateTime: new Date('2024-03-15T18:00:00'),
    venue: 'Hotel Lobby',
    dressCode: 'Smart Casual'
  },
  {
    _id: 'schedule2',
    title: 'Main Ceremony',
    dateTime: new Date('2024-03-16T16:00:00'),
    venue: 'Grand Ballroom',
    dressCode: 'Formal'
  },
  {
    _id: 'schedule3',
    title: 'Cocktail Hour',
    dateTime: new Date('2024-03-16T19:00:00'),
    venue: 'Garden Terrace',
    dressCode: 'Semi-Formal'
  },
  {
    _id: 'schedule4',
    title: 'Dinner & Dancing',
    dateTime: new Date('2024-03-16T20:30:00'),
    venue: 'Grand Ballroom',
    dressCode: 'Formal'
  },
  {
    _id: 'schedule5',
    title: 'After Party',
    dateTime: new Date('2024-03-16T23:00:00'),
    venue: 'Rooftop Terrace',
    dressCode: 'Party Attire'
  },
  {
    _id: 'schedule6',
    title: 'Farewell Brunch',
    dateTime: new Date('2024-03-17T11:00:00'),
    venue: 'Restaurant',
    dressCode: 'Casual'
  }
];

let miniEvents: MiniEvent[] = [
  {
    _id: 'mini1',
    title: 'Photo Booth Corner',
    description: 'Capture memories with our themed photo booth! Professional props and instant prints available.',
    lat: 40.7129,
    long: -74.0059,
    type: 'info'
  },
  {
    _id: 'mini2',
    title: 'Interactive Games Zone',
    description: 'Join us for fun activities and games! Multiple options available for all ages.',
    lat: 40.7127,
    long: -74.0061,
    type: 'game',
    gameOptions: 'Trivia,Charades,Musical Chairs,Dance Off,Karaoke'
  },
  {
    _id: 'mini3',
    title: 'Live Music Stage',
    description: 'Enjoy live performances throughout the evening with local artists and bands.',
    lat: 40.7130,
    long: -74.0058,
    type: 'info'
  },
  {
    _id: 'mini4',
    title: 'Outdoor Activities',
    description: 'Weather permitting, enjoy outdoor games and activities in the garden area.',
    lat: 40.7126,
    long: -74.0062,
    type: 'game',
    gameOptions: 'Lawn Games,Scavenger Hunt,Mini Golf,Ring Toss'
  }
];

let guests: Guest[] = [
  {
    _id: 'guest1',
    userId: '2',
    name: 'Sarah Doe',
    relation: 'Spouse',
    phone: '+1234567895'
  },
  {
    _id: 'guest2',
    userId: '2',
    name: 'Tommy Doe',
    relation: 'Child'
  },
  {
    _id: 'guest3',
    userId: '4',
    name: 'Lisa Johnson',
    relation: 'Partner',
    phone: '+1234567896'
  }
];

let participations: Participation[] = [];

// Mock API functions
export const mockAPI = {
  // User API
  async findByEmailOrPhone(identifier: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return users.find(user => 
      user.email.toLowerCase() === identifier.toLowerCase() || 
      user.phone === identifier
    ) || null;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userIndex = users.findIndex(user => user._id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      return users[userIndex];
    }
    return null;
  },

  async getAllUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async toggleVerification(userId: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userIndex = users.findIndex(user => user._id === userId);
    if (userIndex !== -1) {
      users[userIndex].verified = !users[userIndex].verified;
      return users[userIndex];
    }
    return null;
  },

  // Event API
  async getEvent(): Promise<Event | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return event;
  },

  async updateEvent(updates: Partial<Event>): Promise<Event | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    event = { ...event, ...updates };
    return event;
  },

  // Schedule API
  async getAllSchedules(): Promise<Schedule[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...schedules].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  },

  async createSchedule(scheduleData: Partial<Schedule>): Promise<Schedule> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newSchedule: Schedule = {
      _id: `schedule${Date.now()}`,
      title: scheduleData.title || '',
      dateTime: scheduleData.dateTime || new Date(),
      venue: scheduleData.venue || '',
      dressCode: scheduleData.dressCode || ''
    };
    schedules.push(newSchedule);
    return newSchedule;
  },

  async updateSchedule(scheduleId: string, updates: Partial<Schedule>): Promise<Schedule | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const scheduleIndex = schedules.findIndex(schedule => schedule._id === scheduleId);
    if (scheduleIndex !== -1) {
      schedules[scheduleIndex] = { ...schedules[scheduleIndex], ...updates };
      return schedules[scheduleIndex];
    }
    return null;
  },

  async deleteSchedule(scheduleId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const scheduleIndex = schedules.findIndex(schedule => schedule._id === scheduleId);
    if (scheduleIndex !== -1) {
      schedules.splice(scheduleIndex, 1);
      return true;
    }
    return false;
  },

  // Mini Events API
  async getAllMiniEvents(): Promise<MiniEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...miniEvents];
  },

  async createMiniEvent(eventData: Partial<MiniEvent>): Promise<MiniEvent> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMiniEvent: MiniEvent = {
      _id: `mini${Date.now()}`,
      title: eventData.title || '',
      description: eventData.description || '',
      lat: eventData.lat || 0,
      long: eventData.long || 0,
      type: eventData.type || 'info',
      gameOptions: eventData.gameOptions
    };
    miniEvents.push(newMiniEvent);
    return newMiniEvent;
  },

  async updateMiniEvent(eventId: string, updates: Partial<MiniEvent>): Promise<MiniEvent | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const eventIndex = miniEvents.findIndex(event => event._id === eventId);
    if (eventIndex !== -1) {
      miniEvents[eventIndex] = { ...miniEvents[eventIndex], ...updates };
      return miniEvents[eventIndex];
    }
    return null;
  },

  async deleteMiniEvent(eventId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const eventIndex = miniEvents.findIndex(event => event._id === eventId);
    if (eventIndex !== -1) {
      miniEvents.splice(eventIndex, 1);
      return true;
    }
    return false;
  },

  // Guest API
  async getGuestsByUser(userId: string): Promise<Guest[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return guests.filter(guest => guest.userId === userId);
  },

  async createGuest(guestData: Partial<Guest>): Promise<Guest> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newGuest: Guest = {
      _id: `guest${Date.now()}`,
      userId: guestData.userId || '',
      name: guestData.name || '',
      relation: guestData.relation || '',
      phone: guestData.phone
    };
    guests.push(newGuest);
    return newGuest;
  },

  async updateGuest(guestId: string, updates: Partial<Guest>): Promise<Guest | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const guestIndex = guests.findIndex(guest => guest._id === guestId);
    if (guestIndex !== -1) {
      guests[guestIndex] = { ...guests[guestIndex], ...updates };
      return guests[guestIndex];
    }
    return null;
  },

  async deleteGuest(guestId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const guestIndex = guests.findIndex(guest => guest._id === guestId);
    if (guestIndex !== -1) {
      guests.splice(guestIndex, 1);
      return true;
    }
    return false;
  },

  // Participation API
  async getParticipationByUser(userId: string): Promise<(Participation & { miniEventId: MiniEvent })[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return participations
      .filter(participation => participation.userId === userId)
      .map(participation => ({
        ...participation,
        miniEventId: miniEvents.find(event => event._id === participation.miniEventId)!
      }))
      .filter(participation => participation.miniEventId);
  },

  async createOrUpdateParticipation(
    userId: string, 
    miniEventId: string, 
    status: 'Interested' | 'Not Interested', 
    selectedGame?: string
  ): Promise<Participation> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const existingIndex = participations.findIndex(
      participation => participation.userId === userId && participation.miniEventId === miniEventId
    );
    
    if (existingIndex !== -1) {
      participations[existingIndex].status = status;
      if (selectedGame) participations[existingIndex].selectedGame = selectedGame;
      return participations[existingIndex];
    } else {
      const newParticipation: Participation = {
        _id: `participation${Date.now()}`,
        userId,
        miniEventId,
        status,
        selectedGame
      };
      participations.push(newParticipation);
      return newParticipation;
    }
  }
};