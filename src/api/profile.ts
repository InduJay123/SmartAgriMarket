import api from './api';

// Get buyer profile
export const getBuyerProfile = async () => {
  try {
    const response = await api.get(`/auth/buyer/profile/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer profile:", error);
    return null;
  }
};

// Update buyer profile
export const updateBuyerProfile = async (data: any) => {
  try {
    const response = await api.patch(`/auth/buyer/profile/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating buyer profile:", error);
    return null;
  }
};

//delete buyer profile
export const deleteBuyerProfileImage = async () => {
  try {
    const response = await api.delete(
      `/auth/buyer/profile-image/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return null;
  }
};