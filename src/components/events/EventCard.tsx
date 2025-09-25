import React from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { Event, User } from '../../types';

interface EventCardProps {
  event: Event;
  user: User;
  onRSVP: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, user, onRSVP }) => {
  const isRSVPed = event.rsvpList.includes(user.id);
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  const attendeeCount = event.rsvpList.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-teal-500 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-semibold mb-2">{event.title}</h3>
          {isPastEvent && (
            <span className="inline-block px-2 py-1 bg-gray-600 text-white text-xs rounded">
              Past Event
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-3 text-gray-400" />
            {eventDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-3 text-gray-400" />
            {event.time}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-3 text-gray-400" />
            {event.location}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-3 text-gray-400" />
            {attendeeCount} attending
            {event.maxAttendees && ` • ${event.maxAttendees} max`}
          </div>
        </div>

        {!isPastEvent && (
          <button
            onClick={onRSVP}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
              isRSVPed
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRSVPed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                RSVP'd
              </>
            ) : (
              'RSVP'
            )}
          </button>
        )}
      </div>
    </div>
  );
};