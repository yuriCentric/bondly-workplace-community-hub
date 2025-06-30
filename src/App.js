import React, { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import TravelCarpool from "./components/TravelCarpool";
import LocalRecommendations from "./components/LocalRecommendations";
import EventInterestGroups from "./components/EventInterestGroups";
import SkillSwapMentorship from "./components/SkillSwapMentorship";
import LoginMenu from "./components/LoginMenu";
import Dashboard from "./components/Dashboard";
import BuySellList from "./components/BuySellList";
import { BuySell } from "./components/BuySell";

const PrivateRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <header>
        <h1>Bondly – Your Workplace Community Hub</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <NavLink to="/buy-sell">Buy & Sell</NavLink>
                </li>
                <li>
                  <NavLink to="/travel-carpool">Travel & Carpooling</NavLink>
                </li>
                <li>
                  <NavLink to="/local-recommendations">
                    Local Recommendations
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/event-interest-groups">
                    Event & Interest Groups
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/skill-swap-mentorship">
                    Skill Swap & Mentorship
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div
          style={{
            float: "right",
            marginRight: "20px",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <LoginMenu onLoginChange={setIsLoggedIn} />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/buy-sell"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <BuySellList />
              </PrivateRoute>
            }
          />
          <Route
            path="/buy-sell-add/:id?"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <BuySell />
              </PrivateRoute>
            }
          />
          <Route
            path="/travel-carpool"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <TravelCarpool />
              </PrivateRoute>
            }
          />
          <Route
            path="/local-recommendations"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <LocalRecommendations />
              </PrivateRoute>
            }
          />
          <Route
            path="/event-interest-groups"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <EventInterestGroups />
              </PrivateRoute>
            }
          />
          <Route
            path="/skill-swap-mentorship"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <SkillSwapMentorship />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
