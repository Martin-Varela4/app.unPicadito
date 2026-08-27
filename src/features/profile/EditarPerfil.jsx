import React, { useState } from "react";
import api from "../../api/axiosInstance"; // 👈 1. Importa tu instancia de Axios
import { X, Save, Shield, Calendar, Award } from "lucide-react";

export default function EditarPerfil({ onCancel, onSave, usuarioActual }) {
  // Inicializamos los estados con los datos que ya tiene el usuario actualmente
  const [formData, setFormData] = useState({
    nombre: usuarioActual?.nombre || "",
    posicion: usuarioActual?.posicion || "Delantero",
    avatar: usuarioActual?.avatar || "",
  });
  
  const [loading, setLoading] = useState(false); // Estado para controlar el botón de envío
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 2. Función modificada para conectarse a tu API de Express
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Enviamos el objeto modificado mediante PUT a tu endpoint /api/auth/profile
      const respuesta = await api.put("/auth/profile", formData);
      
      console.log("Servidor responde:", respuesta.data.message);
      
      // Enviamos los datos actualizados de vuelta a la vista padre para refrescar la interfaz
      onSave(respuesta.data.user); 
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setErrorMsg(error.message || "No se pudo actualizar el perfil. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Cabecera */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-xl font-bold">Editar Perfil</h2>
            <p className="text-xs text-slate-400 mt-1">Actualiza tu información de jugador</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {errorMsg}
            </div>
          )}

          {/* Campo Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="Ej. Juan Pérez"
            />
          </div>

          {/* Campo Posición Favorita */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Posición Favorita</label>
            <select
              name="posicion"
              value={formData.posicion}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-white transition-all"
            >
              <option value="Arquero">Arquero</option>
              <option value="Defensor">Defensor</option>
              <option value="Mediocampista">Mediocampista</option>
              <option value="Delantero">Delantero</option>
            </select>
          </div>

          {/* Campo URL de Imagen de Perfil */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">URL de la Foto de Perfil</label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="https://ejemplo.com"
            />
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-600/10 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
