import { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Define the type for an event
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'organizer' | 'attendee' | ''>('');
  const [isSignup, setIsSignup] = useState(false);
  const [events, setEvents] = useState<Event[]>([]); // Updated to store events
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const eventsPerPage = 10; // Limit to 10 events per page  

  const navigate = useNavigate(); // Initialize navigate for redirection
  const location = useLocation();

  // Handle login (marked as async because of await)
  const handleLogin = async (type: 'organizer' | 'attendee') => {
    setIsLoggedIn(true);
    setUserType(type);
    await fetchEvents(); // Fetch events after login/signup
  };

  // Toggle between login and signup
  const toggleSignup = () => {
    setIsSignup((prev) => !prev);
  };

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data); // Store events in the state
      } else {
        console.error('Error fetching events');
      }
    } catch (error) {
      console.error('Fetch events error:', error);
    }
  };


  // Ensure events are fetched after login or when fetchEvents changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn, fetchEvents]);

  // New useEffect to handle refresh state
  useEffect(() => {
    if (location.state && (location.state as any).refreshEvents) {
      fetchEvents();
      // Clear the state to avoid unnecessary refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Get current events based on pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Show login/signup if not logged in
  if (!isLoggedIn) {
    return (
      <div className="App">
        <h1 className="text-center my-4">BookItNow - Event Booking System</h1>
        {!isSignup ? (
          <>
            <Login onLogin={handleLogin} />
            <div className="text-center mt-3">
              <p>New user?</p>
              <button className="btn btn-link" onClick={toggleSignup}>
                Sign Up
              </button>
            </div>
          </>
        ) : (
          <>
            <Signup onLogin={handleLogin} />
            <div className="text-center mt-3">
              <p>Already have an account?</p>
              <button className="btn btn-link" onClick={toggleSignup}>
                Log In
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Display events after successful login for both organizers and attendees
  return (
    <div className="App">
      <h1>Welcome, {userType === 'organizer' ? 'Organizer' : 'Attendee'}</h1>

      {userType === 'organizer' && (
        <>
          {/* Register Event Button */}
          <button
            className="btn btn-primary my-4"
            onClick={() => navigate('/register-event')} // Navigate to the event registration page
          >
            Register Event
          </button>
        </>
      )}

      <h2>Available Events</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
            <th>Ticket Type</th>
            <th>Ticket Price</th>
            <th>Available Tickets</th>
            <th>Organizer Name</th>
            <th>Organizer Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            currentEvents.map((event) => (
              <tr key={event._id}>
                <td>{event.event_name}</td>
                <td>{event.date}</td>
                <td>{event.start_time}</td>
                <td>{event.end_time}</td>
                <td>{event.location}</td>
                <td>{event.ticket_type}</td>
                <td>{event.ticket_price}</td>
                <td>{event.available_tickets}</td>
                <td>{event.organizer_name}</td>
                <td>{event.organizer_email}</td>
                {userType === 'attendee' && (
                  <td>
                    <button
                      className={`btn ${event.available_tickets === 0 ? 'btn-secondary' : 'btn-success'}`}
                      disabled={event.available_tickets === 0}
                      onClick={() => navigate(`/book-ticket/${event._id}`)}
                    >
                      {event.available_tickets === 0 ? 'Sold Out' : 'Book Ticket'}
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center">
                No events available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(events.length / eventsPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default App;





