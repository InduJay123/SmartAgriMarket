import api from "./api";

export const getReviews = async (productId:  number) => {
    try{
        const response = await api(`/reviews/product/${productId}/`)
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
  const res = await api.get(
    `/reviews/summary/${marketId}/`
  );
  return res.data;
};
