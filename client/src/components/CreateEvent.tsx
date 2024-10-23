import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

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
}

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
  });

  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Event creation failed');
      }

      alert('Event created successfully!');

      // Redirect back to the previous page after event creation with a refresh flag
      navigate('/', { state: { refreshEvents: true } });
    } catch (error) {
      console.error('Event creation failed', error);
      alert('Event creation failed');
    }
  };

  return (
    <div className="container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="event_name"
          placeholder="Event Name"
          value={eventData.event_name}
          onChange={handleChange}
          required
        />
        <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
        <input type="time" name="start_time" value={eventData.start_time} onChange={handleChange} required />
        <input type="time" name="end_time" value={eventData.end_time} onChange={handleChange} required />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={eventData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ticket_type"
          placeholder="Ticket Type"
          value={eventData.ticket_type}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="ticket_price"
          placeholder="Ticket Price"
          value={eventData.ticket_price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="available_tickets"
          placeholder="Available Tickets"
          value={eventData.available_tickets}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="organizer_name"
          placeholder="Organizer Name"
          value={eventData.organizer_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="organizer_email"
          placeholder="Organizer Email"
          value={eventData.organizer_email}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;