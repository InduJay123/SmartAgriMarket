const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
