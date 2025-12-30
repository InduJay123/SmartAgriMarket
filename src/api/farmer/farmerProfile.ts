const BASE_URL = "http://127.0.0.1:8000/api/user";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getFarmerProfile = async () => {
  const res = await fetch(`${BASE_URL}/profile/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch farmer profile");
  return res.json();   
};

export const updateFarmerProfile = async (data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update farmer profile");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteFarmerProfileImage = async () => {
  try {
    const res = await fetch(`${BASE_URL}/profile/delete-image/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete profile image");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
