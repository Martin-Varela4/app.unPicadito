import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMyProfile, getPublicProfileById } from "../services/profile.service"; 
import { mapUserToProfile } from "../services/profile.mapper";
import { useAuthStore } from "../../auth/store/useAuthStore";

export const useProfile = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = useAuthStore.getState().token;

      if (!id && !token) {
        setError("No hay sesión activa.");
        setLoading(false);
        return;
      }

      try {
        const rawUser = id ? await getPublicProfileById(id) : await getMyProfile(token);
        
        setProfile(mapUserToProfile(rawUser));

        const listaReviews = Array.isArray(rawUser?.resenasRecibidas)
          ? rawUser.resenasRecibidas
          : [];
        
        setReviews(listaReviews);

      } catch (err) {
        setError(err.message || "No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { profile, reviews, loading, error, isOwnProfile: !id };
};