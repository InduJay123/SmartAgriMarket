import api from './api';

export const fetchFavourites = async () => {
  try {
    const res = await api.get(`/marketplace/favourites/`);
    return res.data; 
  }catch (err) {
    console.error("Error fetching favourites:", err);
    return [];
  }
};

export const toggleFavourite = async (marketId: number) => {
  try {
    const res = await api.post(`/marketplace/favourites/toggle/${marketId}/`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};