import { api } from "../../../api/axiosInstance";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";

export const getMyProfile = async () => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error("No hay un token de sesión activo.");
  }

  const response = await api.get("/users/me");
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.patch("/users/me", profileData);
  return response.data;
};

export const getPublicProfileById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
