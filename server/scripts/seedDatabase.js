import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Schedule from '../models/Schedule.js';
import MiniEvent from '../models/MiniEvent.js';
import Guest from '../models/Guest.js';
import Participation from '../models/Participation.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Schedule.deleteMany({});
    await MiniEvent.deleteMany({});
    await Guest.deleteMany({});
    await Participation.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        email: 'admin@event.com',
        name: 'Event Administrator',
        role: 'admin',
        isVerified: true,
        rsvpStatus: 'accepted'
      },
      {
        email: 'john@example.com',
        name: 'John Smith',
        role: 'guest',
        isVerified: true,
        rsvpStatus: 'accepted',
        travelDetails: {
          arrivalDate: new Date('2024-03-15'),
          departureDate: new Date('2024-03-17'),
          flightNumber: 'AA123',
          accommodation: 'Grand Hotel'
        },
        dietaryRestrictions: ['vegetarian'],
        emergencyContact: {
          name: 'Jane Smith',
          phone: '+1234567890',
          relationship: 'spouse'
        }
      },
      {
        email: 'jane@example.com',
        name: 'Jane Doe',
        role: 'guest',
        isVerified: false,
        rsvpStatus: 'pending'
      },
      {
        email: 'mike@example.com',
        name: 'Mike Johnson',
        role: 'guest',
        isVerified: true,
        rsvpStatus: 'accepted',
        travelDetails: {
          arrivalDate: new Date('2024-03-14'),
          departureDate: new Date('2024-03-18')
        }
      },
      {
        email: 'sarah@example.com',
        name: 'Sarah Wilson',
        role: 'guest',
        isVerified: true,
        rsvpStatus: 'declined'
      }
    ]);
    console.log('Created users');

    // Create event
    const event = await Event.create({
      title: 'Spring Celebration 2024',
      description: 'Join us for a wonderful spring celebration with friends and family.',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-17'),
      location: {
        name: 'Grand Ballroom',
        address: '123 Event Street, City, State 12345',
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
      maxGuests: 150,
      isActive: true
    });
    console.log('Created event');

    // Create schedule items
    const scheduleItems = await Schedule.create([
      {
        eventId: event._id,
        title: 'Welcome Reception',
        description: 'Meet and greet with cocktails and appetizers',
        startTime: new Date('2024-03-15T18:00:00'),
        endTime: new Date('2024-03-15T20:00:00'),
        location: 'Main Lobby',
        type: 'reception',
        isRequired: true
      },
      {
        eventId: event._id,
        title: 'Opening Ceremony',
        description: 'Official opening of the spring celebration',
        startTime: new Date('2024-03-16T10:00:00'),
        endTime: new Date('2024-03-16T11:00:00'),
        location: 'Grand Ballroom',
        type: 'ceremony',
        isRequired: true
      },
      {
        eventId: event._id,
        title: 'Lunch Break',
        description: 'Buffet lunch with various options',
        startTime: new Date('2024-03-16T12:00:00'),
        endTime: new Date('2024-03-16T13:30:00'),
        location: 'Dining Hall',
        type: 'meal'
      },
      {
        eventId: event._id,
        title: 'Afternoon Activities',
        description: 'Various fun activities and games',
        startTime: new Date('2024-03-16T14:00:00'),
        endTime: new Date('2024-03-16T17:00:00'),
        location: 'Activity Center',
        type: 'activity'
      },
      {
        eventId: event._id,
        title: 'Gala Dinner',
        description: 'Formal dinner with entertainment',
        startTime: new Date('2024-03-16T19:00:00'),
        endTime: new Date('2024-03-16T23:00:00'),
        location: 'Grand Ballroom',
        type: 'meal',
        isRequired: true
      },
      {
        eventId: event._id,
        title: 'Farewell Brunch',
        description: 'Final gathering before departure',
        startTime: new Date('2024-03-17T10:00:00'),
        endTime: new Date('2024-03-17T12:00:00'),
        location: 'Garden Terrace',
        type: 'meal'
      }
    ]);
    console.log('Created schedule items');

    // Create mini events
    const miniEvents = await MiniEvent.create([
      {
        eventId: event._id,
        title: 'Photo Booth Fun',
        description: 'Take memorable photos with props and backgrounds',
        type: 'photo',
        maxParticipants: 50,
        startTime: new Date('2024-03-16T14:00:00'),
        endTime: new Date('2024-03-16T17:00:00'),
        location: 'Photo Studio'
      },
      {
        eventId: event._id,
        title: 'Trivia Challenge',
        description: 'Test your knowledge in our fun trivia game',
        type: 'game',
        maxParticipants: 30,
        startTime: new Date('2024-03-16T15:00:00'),
        endTime: new Date('2024-03-16T16:00:00'),
        location: 'Conference Room A'
      },
      {
        eventId: event._id,
        title: 'Live Music Session',
        description: 'Enjoy live performances by local artists',
        type: 'activity',
        maxParticipants: 100,
        startTime: new Date('2024-03-16T20:00:00'),
        endTime: new Date('2024-03-16T22:00:00'),
        location: 'Main Stage'
      },
      {
        eventId: event._id,
        title: 'Garden Walk',
        description: 'Guided tour of the beautiful gardens',
        type: 'activity',
        maxParticipants: 25,
        startTime: new Date('2024-03-17T09:00:00'),
        endTime: new Date('2024-03-17T10:00:00'),
        location: 'Garden Area'
      }
    ]);
    console.log('Created mini events');

    // Create guests
    const guests = await Guest.create([
      {
        userId: users[1]._id, // John's guests
        name: 'Emily Smith',
        age: 8,
        relationship: 'daughter',
        dietaryRestrictions: ['no nuts']
      },
      {
        userId: users[1]._id,
        name: 'Robert Smith',
        age: 12,
        relationship: 'son'
      },
      {
        userId: users[3]._id, // Mike's guest
        name: 'Lisa Johnson',
        age: 35,
        relationship: 'spouse',
        dietaryRestrictions: ['gluten-free']
      }
    ]);
    console.log('Created guests');

    // Create participations
    const participations = await Participation.create([
      {
        userId: users[1]._id,
        miniEventId: miniEvents[0]._id,
        status: 'registered'
      },
      {
        userId: users[1]._id,
        miniEventId: miniEvents[1]._id,
        status: 'completed',
        score: 85
      },
      {
        userId: users[3]._id,
        miniEventId: miniEvents[0]._id,
        status: 'registered'
      },
      {
        userId: users[3]._id,
        miniEventId: miniEvents[2]._id,
        status: 'registered'
      }
    ]);
    console.log('Created participations');

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${scheduleItems.length} schedule items`);
    console.log(`Created ${miniEvents.length} mini events`);
    console.log(`Created ${guests.length} guests`);
    console.log(`Created ${participations.length} participations`);

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();