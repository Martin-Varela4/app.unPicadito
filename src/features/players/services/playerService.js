import { api } from "../../../api/axiosInstance";

/**
 * @param {string} [search] 
 * @param {number} [pagina]
 * @param {number} [limite]
 * @returns {Promise<any>} 
 */
export const getAvailablePlayers = async (search = "", pagina = 1, limite = 12) => {
  const params = { pagina, limite };
  if (search) params.q = search;
  const response = await api.get("/users", { params });
  return response.data;
};
