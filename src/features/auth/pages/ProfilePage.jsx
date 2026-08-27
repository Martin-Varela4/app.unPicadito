import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from "../../../api/axiosInstance"; // 👈 Tu instancia de Axios
import PerfilUsuario from "../../profile/PerfilUsuario"; // 👈 Tu componente de visualización
import EditarPerfil from "../../profile/EditarPerfil"; // 👈 Tu formulario de edición

export default function ProfilePage() {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Cargar datos reales del jugador desde Express al montar la pantalla
    useEffect(() => {
        const obtenerPerfil = async () => {
            try {
                setLoading(true);
                const respuesta = await api.get("/auth/profile");
                setUsuario(respuesta.data); // Guarda { nombre, posicion, avatar, partidos, victorias, etc. }
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
            } finally {
                setLoading(false);
            }
        };
        obtenerPerfil();
    }, []);

    // 2. Función que se ejecuta cuando el formulario PUT responde con éxito
    const handleGuardarDatos = (datosActualizados) => {
        setUsuario(datosActualizados); // Actualiza la tarjeta en caliente
        setEditing(false); // Vuelve a la vista normal de perfil
    };

    // 3. Función para el botón de Cerrar Sesión (mantiene la lógica de tu compañero)
    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 animate-pulse text-sm font-semibold">Cargando datos del jugador...</p>
            </div>
        );
    }

    // 4. El "árbitro" decide qué pantalla renderizar de forma fluida
    if (editing) {
        return (
            <EditarPerfil
                usuarioActual={usuario}
                onCancel={() => setEditing(false)}
                onSave={handleGuardarDatos}
            />
        );
    }

    return (
        <PerfilUsuario 
            usuario={usuario} 
            onEditClick={() => setEditing(true)} 
            onLogoutClick={handleLogout} // Le pasamos la función por si quieres agregar un botón de salir en tu diseño
        />
    );
}
