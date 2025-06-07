import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BookingDetailsPage } from './pages/BookingDetailsPage';

// Route component for booking details that extracts bookingId from URL params
function BookingDetailsRoute() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <BookingDetailsPage 
      bookingId={bookingId}
      onBack={handleBack}
    />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage route */}
        <Route path="/" element={<HomePage />} />
        
        {/* Booking details route */}
        <Route path="/booking/:bookingId" element={<BookingDetailsRoute />} />
        
        {/* Catch-all route - redirect to homepage */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;