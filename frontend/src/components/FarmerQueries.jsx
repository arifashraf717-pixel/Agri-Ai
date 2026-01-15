import React, { useState, useEffect } from "react";

import "./FarmerQueries.css";

// --- SVG Icons ---
const IconMessageSquare = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
const IconClock = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

function FarmerQueries() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("farmerQueriesHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("farmerQueriesHistory", JSON.stringify(history));
  }, [history]);

  const suggestions = [
    { question: "Best fertilizer for wheat" },
    { question: "How to control pests in rice" },
    { question: "Optimal feeding for Gir cows" },
    { question: "When to irrigate maize fields" },
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return alert("Please type a question");

    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error ${res.status}: ${errText}`);
      }

      const data = await res.json();

      if (data.error) {
        setAnswer("⚠️ Error: " + data.error);
      } else {
        setAnswer(data.answer);
        setHistory((prev) => [
          { question: query.trim(), answer: data.answer, ts: Date.now() },
          ...prev,
        ]);
      }
    } catch (err) {
      setAnswer("❌ Network/Server error: " + err.message);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const handleSuggestion = (q) => {
    setQuery(q);
    setAnswer(null);
  };

  return (
    <div className="container my-4">
      <div className="card p-4 mb-4">
        <div>
          <h3 className="mb-1"><IconMessageSquare style={{ color: '#00a76f', marginRight: '0.5rem' }} />Farmer Queries</h3>
          <p className="mb-2">Ask anything about crops, livestock or farm management.</p>
        </div>

        <div className="mb-3 mt-3">
          <strong>Suggested topics:</strong>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="btn btn-outline-success btn-sm"
                onClick={() => handleSuggestion(s.question)}
              >
                {s.question}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your question here..."
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Thinking..." : "Submit"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
              Back
            </button>
          </div>
        </form>

        {loading && <div className="mt-3 alert alert-info">AI is preparing an answer...</div>}

        {answer && (
          <div className="alert alert-success-answer mt-3">
            <strong>Answer:</strong>
            <div style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>{answer}</div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="card p-3">
          <h5>Previous Queries</h5>
          <ul className="list-group list-group-flush">
            {history.map((h, idx) => (
              <li key={idx} className="list-group-item">
                <div>
                  <strong>Q:</strong> {h.question}
                </div>
                <div style={{ whiteSpace: "pre-wrap", paddingLeft: '1rem', color: '#333' }}>
                  <strong>A:</strong> {h.answer}
                </div>
                <small className="text-muted d-flex align-items-center gap-1 mt-1">
                  <IconClock style={{ width: '12px', height: '12px' }} />
                  Asked on: {new Date(h.ts).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FarmerQueries;
