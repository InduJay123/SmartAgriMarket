import api from "../api";

// Get logged-in farmer profile
export const getFarmerProfile = async () => {
  try {
    const res = await api.get("/farmer/profile/");
    console.log("PROFILE DATA FROM BACKEND:", res);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Update logged-in farmer profile
export const updateFarmerProfile = async (data: any) => {
  const response = await api.put("/farmer/profile/", data);
  return response.data;
};

// Delete profile image
export const deleteFarmerProfileImage = async () => {
  const response = await api.delete("/farmer/profile/image/");
  return response.data;
};
