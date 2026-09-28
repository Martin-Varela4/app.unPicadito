import { api } from "../../../api/axiosInstance";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";

export const getMyProfile = async () => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error("No hay un token de sesión activo.");
  }

  const response = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPublicProfileById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getUserReviews = async (userId) => {
  const response = await api.get(`/reviews/ranking/${userId}`);
  console.log("FORMA REAL de /reviews/ranking:", response.data); 
  return response.data;
};