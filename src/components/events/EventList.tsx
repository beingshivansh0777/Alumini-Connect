import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';
import { User, Event } from '../../types';
import { getEvents, saveEvent } from '../../utils/localStorage';
import { EventCard } from './EventCard';

interface EventListProps {
  user: User;
}

export const EventList: React.FC<EventListProps> = ({ user }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleRSVP = (eventId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const isAlreadyRSVPed = event.rsvpList.includes(user.id);
        const updatedEvent = {
          ...event,
          rsvpList: isAlreadyRSVPed
            ? event.rsvpList.filter(id => id !== user.id)
            : [...event.rsvpList, user.id]
        };
        saveEvent(updatedEvent);
        return updatedEvent;
      }
      return event;
    });
    
    setEvents(updatedEvents);
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    switch (filter) {
      case 'upcoming':
        return eventDate >= today;
      case 'past':
        return eventDate < today;
      default:
        return true;
    }
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-600 mt-1">Discover and attend college events</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past Events</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No {filter === 'all' ? '' : filter} events found</p>
          <p className="text-sm text-gray-400">Check back later for new events</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              user={user}
              onRSVP={() => handleRSVP(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};