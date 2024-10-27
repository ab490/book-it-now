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
        <div className="table-container">
            <h2>Available Events</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <tr key={event._id}>
                                <td>{event.event_name}</td>
                                <td>{event.date}</td>
                                <td>{event.location}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center">
                                No events available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ViewEvents;