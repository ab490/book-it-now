import { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

interface Event {
  _id: string;
  event_name: string;
  description: string;
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
interface User {
  firstName: string;
  email: string;
  phone: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'organizer' | 'attendee' | ''>('');
  const [isSignup, setIsSignup] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('');
    setUser(null);
    setEvents([]);
    setCurrentPage(1);
    localStorage.clear();
    navigate('/');
  };

  const handleLogin = async (type: 'organizer' | 'attendee', user: { firstName: string, email: string, phone: string }) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUser(user);
    await fetchEvents();
  };

  const toggleSignup = () => {
    setIsSignup((prev) => !prev);
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Error fetching events');
      }
    } catch (error) {
      console.error('Fetch events error:', error);
    }
  };


  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn, fetchEvents]);

  useEffect(() => {
    if (location.state && (location.state as any).refreshEvents) {
      fetchEvents();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!isLoggedIn) {
    return (
      <div className="App">
        <h1 className="text-center my-4">BookItNow - Events Just a Click Away!</h1>

        {!isSignup ? (
          <>
            <Login onLogin={handleLogin} />
            <div className="text-center mt-3">
              <p style={{ color: '#e0e0e0' }}>New user?</p>
              <button className="btn btn-link" onClick={toggleSignup}>
                Sign Up
              </button>
            </div>
          </>
        ) : (
          <>
            <Signup onLogin={handleLogin} />
            <div className="text-center mt-3">
              <p style={{ color: '#e0e0e0' }}>Already have an account?</p>
              <button className="btn btn-link" onClick={toggleSignup}>
                Log In
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <div className="position-relative mb-4">
        <h1 className="text-center">Welcome {userType.charAt(0).toUpperCase() + userType.slice(1)} {user?.firstName ? user.firstName : (userType === 'organizer' ? 'Organizer' : 'Attendee')}</h1>
        <button
          className="btn btn-danger btn-sm position-absolute"
          onClick={handleLogout}
          style={{
            top: '10px',
            right: '10px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem'
          }}
        >
          Logout
        </button>
      </div>

      {userType === 'organizer' && (
        <>
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate('/register-event')}
          >
            Register Event
          </button>
        </>
      )}

      <h2 style={{ marginTop: '0.1em' }}>Events</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
            <th>Ticket Type</th>
            <th>Ticket Price</th>
            <th>Available Tickets</th>
            <th>Organizer Name</th>
            <th>Organizer Email</th>
            {userType === 'attendee' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            currentEvents.map((event) => (
              <tr key={event._id}>
                <td>{event.event_name}</td>
                <td>{event.description}</td>
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
    </div >
  );
}

export default App;
