import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Event {
    _id: string;
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

function BookTicket() {
    const { eventId } = useParams(); // Get the event ID from the URL
    const navigate = useNavigate();

    const [event, setEvent] = useState<Event | null>(null);   // Set event type to Event or null
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        number_of_tickets: 1,
        booking_status: 'confirmed',
        payment_status: 'pending',
    });

    // Fetch event details using eventId
    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
                if (response.ok) {
                    const data = await response.json();
                    setEvent(data);
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        }
        fetchEvent();
    }, [eventId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!event) return;

        // Safeguard: Prevent booking if no tickets are available
        if (event.available_tickets <= 0) {
            alert('No tickets available for this event.');
            return;
        }

        try {
            // Save booking information in the tickets collection
            const bookingResponse = await fetch('http://localhost:5000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, event_id: eventId, booking_date: new Date().toISOString() }),
            });

            if (!bookingResponse.ok) {
                throw new Error('Booking failed');
            }

            // Update the number of available tickets in the events collection
            await fetch(`http://localhost:5000/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    available_tickets: event.available_tickets - formData.number_of_tickets,
                }),
            });

            alert('Booking confirmed!');
            navigate('/');
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed.');
        }
    };

    return (
        <div className="container">
            <h2>Book Tickets for {event?.event_name}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="customer_name"
                    placeholder="Your Name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="customer_email"
                    placeholder="Your Email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="customer_phone"
                    placeholder="Phone Number"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="number_of_tickets"
                    placeholder="Number of Tickets"
                    value={formData.number_of_tickets}
                    onChange={handleChange}
                    required
                    min="1"
                    max={event?.available_tickets || 1}
                />
                <button type="submit" className="btn btn-primary">
                    Confirm Booking
                </button>
            </form>
        </div>
    );
}

export default BookTicket;