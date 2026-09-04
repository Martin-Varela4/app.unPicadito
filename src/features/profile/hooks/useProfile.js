// src/features/profile/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { getProfileData } from '../services/profileService';

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // 1. Obtenemos el token almacenado (asumiendo que lo guardas en localStorage al loguearte)
        const token = localStorage.getItem('token'); 
        
        if (!token) {
          throw new Error("No se encontró una sesión activa.");
        }

        // 2. Llamamos al servicio del frontend que creamos en el paso anterior
        const data = await getProfileData(token);
        
        // 3. Guardamos los datos del usuario en el estado
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // El array vacío asegura que solo se ejecute una vez cuando se monte el componente

  // Devolvemos el estado para que la vista lo consuma
  return { user, loading, error };
};
