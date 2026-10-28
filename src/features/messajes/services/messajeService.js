import api from '../../../api/axiosInstance';

export const getChatHistory = async (user1, user2) => {
    const response = await api.get(`/messages/${user1}/${user2}`);
    return response.data;
};

export const getFriendsChat = async (userId) => {
    const response = await api.get(`/friendships/${userId}`);
    return response.data;
};
