const BASE_URL = "http://127.0.0.1:8000/api/farmer";

export const getFarmerProfile = async (userId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/${userId}/`);
    if (!res.ok) throw new Error("Failed to fetch farmer profile");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateFarmerProfile = async (userId: number, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/${userId}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update farmer profile");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteFarmerProfileImage = async (userId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/${userId}/delete-image/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete profile image");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
