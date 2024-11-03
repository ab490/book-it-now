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

//    const uri = `${process.env.REACT_APP_API_URL}/api/events/${eventId}`;
    const uri = `https://book-it-now-backend.onrender.com/api/events/${eventId}`;

    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await fetch(uri);
	        console.log('Environment Variable:', process.env.REACT_APP_API_URL);
	        console.log('Full URL /api/events/${eventId}:', uri);
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
        <div className="min-h-screen flex items-center justify-center">
            <div className="translucent-container p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg">
                <h2 style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }} className="text-3xl font-bold text-white text-center mb-6">
                    Book Tickets for {event?.event_name}
                </h2>
                {event && (
                    <div className="bg-white/20 p-4 mb-6 rounded-lg text-white">
                        <p className="mb-2">Available Tickets: {event.available_tickets}</p>
                        <p className="mb-2">Price per Ticket: ${event.ticket_price}</p>
                        <p className="font-semibold">Total Price: ${totalPrice}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="attendee_name"
                        placeholder="Your Name"
                        value={formData.attendee_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 label-spacing"
                        required
                        disabled={isSubmitting}
                    />
                    <input
                        type="email"
                        name="attendee_email"
                        placeholder="Your Email"
                        value={formData.attendee_email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 label-spacing"
                        required
                        disabled={isSubmitting}
                    />
                    <input
                        type="tel"
                        name="attendee_phone"
                        placeholder="Phone Number"
                        value={formData.attendee_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isSubmitting}
                    />
                    <div>
                        <label htmlFor="number_of_tickets" className="text-white mt-4 mb-5 block label-spacing">
                            Number of Tickets
                        </label>
                        <input
                            type="number"
                            name="number_of_tickets"
                            placeholder="Number of Tickets"
                            value={formData.number_of_tickets}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                            min="1"
                            max={event?.available_tickets || 1}
                            disabled={isSubmitting}
                        />
                    </div>
                    <button
                        type="button"
                        className="px-4 py-3 border rounded-md hover:border-blue-500 transition-colors"
                        style={{ marginRight: '18px' }}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl"
                        disabled={isSubmitting || !event?.available_tickets}
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 bg-red-600 text-white p-4 rounded-lg">
                        <p>{error}</p>
                        <button onClick={() => setError(null)} className="mt-2 underline">
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookTicket;
