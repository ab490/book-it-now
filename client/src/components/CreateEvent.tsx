import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface EventForm {
  event_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  ticket_type: string;
  ticket_price: number;
  available_tickets: number;
  organizer_name: string;
  organizer_email: string;
  description: string;
}

const TICKET_TYPES = ['General', 'VIP', 'Student', 'Early Bird'];

function CreateEvent() {
  const [eventData, setEventData] = useState<EventForm>({
    event_name: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    ticket_type: '',
    ticket_price: 0,
    available_tickets: 0,
    organizer_name: '',
    organizer_email: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<EventForm>>({});

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof EventForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submitting event data:", eventData);

    const uri = process.env.REACT_APP_API_URL;

    try {
      const response = await fetch(`${uri}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      navigate('/', { state: { refreshEvents: true } });
    } catch (error) {
      console.error('Event creation failed:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="translucent-container p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg">
        <h2 style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }} className="text-3xl font-bold text-white text-center">Register Your Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Organizer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">Name</label>
              <input
                type="text"
                name="organizer_name"
                value={eventData.organizer_name}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter organizer's name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">
                Email
              </label>
              <input
                type="email"
                name="organizer_email"
                value={eventData.organizer_email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter organizer's email"
                required
              />
            </div>
          </div>

          {/* Basic Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">
                Event Name
              </label>
              <input
                type="text"
                name="event_name"
                value={eventData.event_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.event_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter event name"
                required
              />
              {errors.event_name && (
                <p className="mt-1 text-sm text-red-500">{errors.event_name}</p>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">
                Start Time
              </label>
              <input
                type="time"
                name="start_time"
                value={eventData.start_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">
                End Time
              </label>
              <input
                type="time"
                name="end_time"
                value={eventData.end_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.end_time && (
                <p className="mt-1 text-sm text-red-500">{errors.end_time}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2 label-spacing">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event location"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2 label-spacing">
              Event Description
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your event..."
              required
            />
          </div>

          {/* Ticket Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">
                Ticket Type
              </label>
              <select
                name="ticket_type"
                value={eventData.ticket_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {TICKET_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">
                Ticket Price ($)
              </label>
              <input
                type="number"
                name="ticket_price"
                value={eventData.ticket_price}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2 label-spacing">
                Available Tickets
              </label>
              <input
                type="number"
                name="available_tickets"
                value={eventData.available_tickets}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              className="px-6 py-2 border rounded-md hover:border-blue-500 transition-colors"
              style={{ marginRight: '18px' }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 border rounded-md hover:border-blue-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
