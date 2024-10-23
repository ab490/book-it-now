import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import CreateEvent from './components/CreateEvent';
import BookTicket from './components/BookTicket';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register-event" element={<CreateEvent />} /> {/* Route for event registration */}
        <Route path="/book-ticket/:eventId" element={<BookTicket />} /> {/* Route for booking tickets */}
      </Routes>
    </Router>
  </StrictMode>
);
