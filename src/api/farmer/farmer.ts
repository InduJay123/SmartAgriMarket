import api from "../api";

// GET farmer profile
export const getFarmerProfile = async () => {
  return await api.get("/profile/");
};

// UPDATE farmer profile
export const updateFarmerProfile = async (data: any) => {
  return await api.put("/profile/", data);
};

// DELETE profile image
export const deleteFarmerProfileImage = async () => {
  return await api.delete("/profile/delete-image/");
};
