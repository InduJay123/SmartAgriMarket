import api from "../api";

export const postFormData = (endpoint: string, data: FormData, p0: { headers: { "Content-Type": string; }; }) => {
  return api.post(endpoint, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

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
