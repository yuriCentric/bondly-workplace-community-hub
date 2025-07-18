import React, { useRef, useState, useEffect } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import TravelCarpool from "./components/TravelCarpool";
import LocalRecommendations from "./components/LocalRecommendations";
import EventInterestGroups from "./components/EventInterestGroups";
import { SkillSwapMentorship } from "./components/SkillSwapMentorship";
import SkillSwapList from "./components/SkillSwapList";
import Dashboard from "./components/Dashboard";
import BuySellList from "./components/BuySellList";
import { BuySell } from "./components/BuySell";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import TravelCarpoolAdd from "./components/TravelCarPoolAdd";
import MicrosoftAuth from "./components/MicrosoftAuth";
import AddEventInterest from "./components/AddEventInterest";
import { FiLogOut } from "react-icons/fi";
import logo from "./logo.svg";

const PrivateRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello, I am Mr. Bondly! How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);

  const [travelItems, setTravelItems] = useState([]);
  const [buySellItems, setBuySellItems] = useState([]);
  const [eventItems, setEventItems] = useState([]);
  const [skillItems, setSkillItems] = useState([]);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const travelRes = await fetch("http://localhost:4000/travel-items");
        const travelData = await travelRes.json();
        setTravelItems(travelData);

        const buySellRes = await fetch("http://localhost:4000/items");
        const buySellData = await buySellRes.json();
        setBuySellItems(buySellData);

        const eventsRes = await fetch(
          "http://localhost:4000/event-interest-groups"
        );
        const eventsData = await eventsRes.json();
        setEventItems(eventsData);

        const skillRes = await fetch(
          "http://localhost:4000/skill-swap-mentorship"
        );
        const skillData = await skillRes.json();
        setSkillItems(skillData);
      } catch (error) {
        console.error("Failed to fetch API data:", error);
      }
    };

    fetchData();
  }, []);

  const callChatGPT = async (userMessage) => {
    setLoading(true);

    const travelSummary = travelItems
      .map(
        (t) =>
          `Trip from ${t.travelFrom} to ${t.travelTo} on ${new Date(
            t.date
          ).toLocaleDateString()} for ${t.numberOfPassengers} passenger(s)`
      )
      .join("; ");

    const itemSummary = buySellItems
      .map(
        (i) =>
          `${i.title} available in ${i.city} for ₹${i.price}. Description: ${i.description}`
      )
      .join("; ");
    const eventSummary = eventItems
      .map(
        (e) =>
          `${e.title} and description: ${e.description} on ${e.date} at ${e.time}, hosted by ${e.department}. Location: ${e.location}. Audience: ${e.audience}. Posted by ${e.postedBy}.`
      )
      .join("; ");

    const skillSummary = skillItems
      .map(
        (s) =>
          `${s.skillName} (${s.proficiency}) - ${s.intent}. ${s.description} [Type: ${s.skillType}]`
      )
      .join("; ");

    const systemContext = `
You are a helpful assistant. Here is the current community data:

Travel Listings:
${travelSummary}

Buy/Sell Listings:
${itemSummary}

Events:
${eventSummary}

Skill Swap & Mentorship:
${skillSummary}
`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemContext },
            ...messages.map((m) => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content || "Sorry, I didn't get that.";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error connecting to ChatGPT API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    callChatGPT(userMsg);
  };

  return (
    <div>
      <header>
        <h1>Bondly – Your Workplace Community Hub</h1>
        <nav>
          <ul>
            {isLoggedIn && (
              <li>
                <NavLink to="/" end>
                  Home
                </NavLink>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <NavLink to="/buy-sell">Buy & Sell</NavLink>
                </li>
                <li>
                  <NavLink to="/travel-carpool">Travel & Carpooling</NavLink>
                </li>
                {/* <li>
                  <NavLink to="/local-recommendations">
                    Local Recommendations
                  </NavLink>
                </li> */}
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
              </>
            )}
          </ul>
        </nav>
        <div
          style={{
            float: "right",
            alignItems: "center",
            borderRadius: "8px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {!isLoggedIn ? (
            <MicrosoftAuth onLoginChange={setIsLoggedIn} />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  fontFamily: "sans-serif",
                }}
              >
                <span style={{ fontWeight: "500", color: "#333" }}>
                  ✅ Logged in
                </span>
                <FiLogOut
                  onClick={() => setIsLoggedIn(false)}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.3rem",
                    color: "#dc3545",
                  }}
                  title="Logout"
                />
              </div>{" "}
            </>
          )}
        </div>
      </header>
      <main
        style={{
          backgroundColor: "#f0f4f8",
          minHeight: "100vh",
          padding: "40px 0",
          paddingTop: "100px",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/buy-sell"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <BuySellList />
              </PrivateRoute>
            }
          />
          <Route
            path="/buy-sell/add/:id?"
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
            path="/travel-carpool/add/:id?"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <TravelCarpoolAdd />
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
            path="/event-interest-groups/add/:id?"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <AddEventInterest />
              </PrivateRoute>
            }
          />
          <Route
            path="/skill-swap-mentorship"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <SkillSwapList />
              </PrivateRoute>
            }
          />
          <Route
            path="/skill-swap-mentorship/add/:id?"
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

      {/* Chatbot Icon */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            backgroundColor: "#004080",
            color: "#fff",
            borderRadius: "50%",
            padding: "16px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        >
          <FaComments size={24} />
        </button>
      </div>

      {/* Chatbot UI */}
      <div
        style={{
          position: "fixed",
          bottom: "90px",
          right: chatOpen ? "20px" : "-320px",
          width: "300px",
          height: "400px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          transition: "right 0.3s ease-in-out",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 999,
        }}
      >
        <div
          style={{
            backgroundColor: "#004080",
            color: "#fff",
            padding: "12px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Mr. Bondly - Your Assistant
        </div>
        <div
          style={{
            flex: 1,
            padding: "12px",
            overflowY: "auto",
            backgroundColor: "#f5f5f5",
            scrollBehavior: "smooth",
          }}
        >
          {messages.map((msg, index) => {
            const isLast = index === messages.length - 1;
            return (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  textAlign: msg.from === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    backgroundColor:
                      msg.from === "user" ? "#004080" : "#e0e0e0",
                    color: msg.from === "user" ? "#fff" : "#000",
                    maxWidth: "75%",
                    wordWrap: "break-word", // ✅ wrap long words
                    whiteSpace: "pre-wrap", // ✅ preserve line breaks
                    overflowWrap: "break-word", // ✅ break overflow
                    border: isLast ? "2px solid #ff9800" : "none",
                    boxShadow: isLast
                      ? "0 0 8px rgba(255, 152, 0, 0.6)"
                      : "none",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />

          {loading && (
            <div
              style={{ textAlign: "left", color: "#999", fontStyle: "italic" }}
            >
              Bot is typing...
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            padding: "6px 8px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "6px 10px",
              fontSize: "14px",
              borderRadius: "16px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              backgroundColor: "#004080",
              color: "#fff",
              marginLeft: "6px",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
      {/* Company Logo in Bottom-Left */}
      <div
        style={{
          position: "fixed",
          top: "30px",
          left: "40px",
          zIndex: 1000,
          backgroundColor: "white",
        }}
      >
        <img
          src={logo}
          alt="Company Logo"
          style={{
            width: "100px",
            height: "40px",
            opacity: 0.8,
            transition: "transform 0.3s",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        />
      </div>
    </div>
  );
};

export default App;
