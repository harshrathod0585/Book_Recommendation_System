import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [userId, setUserId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRandomUserId = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:5000/userid");
      const randomUserId = response.data.user_id;
      setUserId(randomUserId);
      fetchRecommendations(randomUserId);
    } catch (error) {
      console.error("Error fetching random user ID:", error);
      alert("Failed to fetch a random user ID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/recommend/${userId}`);
      setRecommendations(response.data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-white">Book Recommendation System</h1>
      <button
        className="btn btn-primary mt-3"
        onClick={fetchRandomUserId}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Random User and Recommendations"}
      </button>

      <div className="mt-5">
        {userId && (
          <div className="mb-4">
            <h3 className="text-white">Recommendations for User ID: {userId}</h3>
          </div>
        )}

        <h2 className="text-white">Recommended Books:</h2>
        {recommendations.length === 0 ? (
          <p className="text-white">
            No recommendations yet. Click the button to fetch recommendations.
          </p>
        ) : (
          <div className="card-container">
            {recommendations.map((book, index) => (
              <div className="card" key={index}>
                <img
                  src={book["Book-image"]}
                  className="card-img-top"
                  alt={book["Book-Title"]}
                />
                <div className="card-body">
                  <h5 className="card-title">{book["Book-Title"]}</h5>
                  <p className="card-text">Author: {book["Book-Author"]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
