import React, { useEffect, useState } from "react";

const placeId = "ChIJwd3xgpljzZQRxjbOHBcjjS4"; // Bar do Hélio

function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://us-central1-menu-fast-a836a.cloudfunctions.net/getGoogleReviews?placeId=${placeId}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Pega apenas as 10 últimas avaliações (mais recentes)
        const reviews = (data.reviews || []).slice(0, 10);
        setReviews(reviews);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando avaliações...</div>;

  return (
    <div>
      <h2>Avaliações do Google</h2>
      {reviews.length === 0 && <p>Nenhuma avaliação encontrada.</p>}
      <ul>
        {reviews.map((review, idx) => (
          <li key={idx} style={{ marginBottom: "16px" }}>
            <strong>{review.author_name}</strong> — Nota: {review.rating} ⭐<br />
            <span>{review.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoogleReviews;
