import api from "../../../config/axios.js";

export const getChatHistory = async (user1, user2) => {
    const response = await api.get(`/messages/${user1}/${user2}`);
    return response.data;
};