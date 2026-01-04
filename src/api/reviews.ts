import axios from "axios";
import api from "./api";

const API_BASE = "http://127.0.0.1:8000/api/reviews";

export const getReviews = async (productId:  number) => {
    try{
        const response = await axios.get(`${API_BASE}/product/${productId}/`)
        console.log(response.data);
        return response.data;
    }catch(err){
         console.error("Error fetching product reviews:", err);
        return null;
    }
};

export const addReview = async (productId: number, rating: number, comment: string) => {
    try {
        const response = await api.post(`/reviews/add/`, {
            product: productId,
            rating,
            comment
        });
        return response.data;
    } catch (err) {
        console.error("Error adding review:", err);
        return null;
    }
};

export const getReviewSummary = async (marketId: number) => {
  const res = await axios.get(
    `${API_BASE}/summary/${marketId}/`
  );
  return res.data;
};
