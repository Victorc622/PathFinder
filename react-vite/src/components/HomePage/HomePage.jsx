import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./HomePage.css";

const Home = () => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Plan Your Dream Trips with Ease</h1>
          <p>
            Create itineraries, explore destinations, and organize all your travel plans in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">Get Started</Link>
            {!sessionUser && (
              <Link to="/login" className="btn-secondary">Log In</Link>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <img src="/images/Itinerary.webp" alt="Itinerary" />
            <h3>Easy Itinerary Planning</h3>
            <p>Drag and drop to plan your day with our intuitive tools.</p>
          </div>
          <div className="feature-item">
            <img src="/images/GoogleMapsPicture.avif" alt="Map" />
            <h3>Interactive Maps</h3>
            <p>Visualize your trips and destinations on detailed maps.</p>
          </div>
          <div className="feature-item">
            <img src="/images/Collab_Lilac.webp" alt="Share" />
            <h3>Collaborative Tools</h3>
            <p>Invite friends to plan together and make memories.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        {sessionUser ? (
          <div className="logged-in-cta">
            <h2>Welcome Back, {sessionUser.username}!</h2>
            <p>Ready to plan your next adventure?</p>
            <Link to="/trips" className="btn-primary">View My Trips</Link>
          </div>
        ) : (
          <div className="logged-out-cta">
            <h2>Start Planning Your Next Adventure</h2>
            <Link to="/signup" className="btn-primary">Sign Up for Free</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;