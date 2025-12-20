import axios from 'axios';
const USER_ID = 1;

export const fetchFavourites = async () => {
  const res = await axios.get(
    `http://127.0.0.1:8000/api/favourites/?user_id=${USER_ID}`
  );
  return res.data;
};

export const toggleFavourite = async (productId: number) => {
  return axios.post('http://127.0.0.1:8000/api/favourites/toggle/', {
    product_id: productId,
    user_id: USER_ID
  });
};
