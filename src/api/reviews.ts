import axios from "axios";

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

export const addReview = async (productId: number, userId: number, rating: number, comment: string) => {
    try {
        const response = await axios.post(`${API_BASE}/add/`, {
            product: productId,
            user: userId,
            rating,
            comment
        });
        return response.data;
    } catch (err) {
        console.error("Error adding review:", err);
        return null;
    }
};