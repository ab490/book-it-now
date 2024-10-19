import { useState, useEffect } from 'react';

interface Event {
    _id: string;
    event_name: string;
    date: string;
    location: string;
}

function ViewEvents() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            <h2>Available Events</h2>
            <ul>
                {events.map((event) => (
                    <li key={event._id}>
                        {event.event_name} - {event.date} - {event.location}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewEvents;