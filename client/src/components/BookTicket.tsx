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

interface ApiError {
    message: string;
    error?: any;
}

function BookTicket() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    const [formData, setFormData] = useState({
        attendee_name: '',
        attendee_email: '',
        attendee_phone: '',
        number_of_tickets: 1,
        booking_status: 'confirmed',
        payment_status: 'pending',
    });

    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch event: ${response.statusText}`);
                }
                const data = await response.json();
                setEvent(data);
                setTotalPrice(data.ticket_price * formData.number_of_tickets);
            } catch (error) {
                setError('Failed to load event details. Please try again later.');
                console.error('Error fetching event details:', error);
            }
        }
        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        if (event) {
            setTotalPrice(event.ticket_price * formData.number_of_tickets);
        }
    }, [formData.number_of_tickets, event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!event) {
            setError('Event not found');
            setIsSubmitting(false);
            return;
        }

        try {
            const ticketData = {
                ...formData,
                event_id: eventId,
                total_price: totalPrice
            };

            const response = await fetch('http://localhost:5000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            });

            const data = await response.json() as ApiError;

            if (!response.ok) {
                throw new Error(data.message || 'Failed to book tickets');
            }

            alert('Booking successful!');
            navigate('/');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            console.error('Booking error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Booking Failed</h4>
                    <p>{error}</p>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-primary"
                            onClick={() => setError(null)}
                        >
                            Try Again
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/')}
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h2>Book Tickets for {event?.event_name}</h2>
            {event && (
                <div className="card mb-4">
                    <div className="card-body">
                        <p className="mb-2">Available Tickets: {event.available_tickets}</p>
                        <p className="mb-0">Price per Ticket: ${event.ticket_price}</p>
                        <p className="mt-2"><strong>Total Price:</strong> ${totalPrice}</p> {/* Total price displayed */}
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        name="attendee_name"
                        placeholder="Your Name"
                        value={formData.attendee_name}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        name="attendee_email"
                        placeholder="Your Email"
                        value={formData.attendee_email}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="tel"
                        name="attendee_phone"
                        placeholder="Phone Number"
                        value={formData.attendee_phone}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="number_of_tickets" className="form-label">
                        Number of Tickets
                    </label>
                    <input
                        type="number"
                        name="number_of_tickets"
                        placeholder="Number of Tickets"
                        value={formData.number_of_tickets}
                        onChange={handleChange}
                        className="form-control"
                        required
                        min="1"
                        max={event?.available_tickets || 1}
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !event?.available_tickets}
                >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
}

export default BookTicket;