const API_BASE = "http://127.0.0.1:8000/api";

export const getProductReviews = async (productId: number) => {
  const res = await fetch(
    `${API_BASE}/reviews/product/${productId}/`
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json();
};

export const getReviewSummary = async (productId: number) => {
  const res = await fetch(
    `${API_BASE}/reviews/product/${productId}/summary/`
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json();
};
