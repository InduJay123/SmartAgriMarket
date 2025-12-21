import axios from 'axios';
const USER_ID = 1;
const BASE_URL = "http://127.0.0.1:8000/api";

export const fetchFavourites = async () => {
  const res = await axios.get(
    `${BASE_URL}/favourites/?user_id=${USER_ID}`
  );
  return res.data;
};

export const toggleFavourite = async (productId: number) => {
  return axios.post('${BASE_URL}/api/favourites/toggle/', {
    product_id: productId,
    user_id: USER_ID
  });
};
