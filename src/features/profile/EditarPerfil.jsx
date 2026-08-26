import { useState } from "react";
import { Camera, Save, ArrowLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import axios from "axios"

// Datos de ejemplo, luego los agregamos desde el array de objetos de
// los usuarios con la función .get

const initialData = {
  name: "Juan Antonio Iturrigaray",
  username: "Antonito10armando",
  avatar:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
  about:
    "fut fut futbooollllll.",
  age: 50,
  location: "Cerro Porteño, Paraguay",
  playingSince: 7,
  position: "Delantero",
};

const positions = [
  "Arquero",
  "Defensor",
  "Mediocampista",
  "Delantero",
];

export default function EditProfileForm({ onCancel, onSave }) {
  const [formData, setFormData] = useState(initialData);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatar);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setFormData((prev) => ({ ...prev, avatarFile: file }));
    }
  }

  // 1. Asegúrate de importar axios arriba de todo en tu archivo:
// import axios from "axios";

async function handleSubmit(e) {
  e.preventDefault(); // Evita que la página se recargue

  // 2. Creamos el contenedor FormData obligatorio para enviar archivos binarios e inputs
  const dataToSend = new FormData();

  // 3. Adjuntamos los campos de texto individuales desde tu estado formData
  dataToSend.append("name", formData.name);
  dataToSend.append("username", formData.username);
  dataToSend.append("about", formData.about);
  dataToSend.append("age", formData.age);
  dataToSend.append("location", formData.location);
  dataToSend.append("playingSince", formData.playingSince);
  dataToSend.append("position", formData.position);

  // 4. Si el usuario seleccionó una imagen nueva, la adjuntamos
  // El nombre 'avatarFile' debe coincidir exactamente con el de Multer en tu Express
  if (formData.avatarFile) {
    dataToSend.append("avatarFile", formData.avatarFile);
  }

  try {
    // Supongamos que tienes el ID del usuario actual. Ejemplo: "65f81234..."
    const usuarioId = "ID_DEL_USUARIO_ACTUAL"; 

    // 5. Hacemos la petición PUT a Express enviando el FormData
    const respuesta = await axios.put(`http://localhost:5000/api/profile/${usuarioId}`, dataToSend, {
      headers: {
        "Content-Type": "multipart/form-data", // Le avisa al servidor que viaja una imagen
      },
    });

    console.log("¡Perfil actualizado con éxito en la base de datos!", respuesta.data);

    // 6. Ejecutamos la función onSave que pasaste por props para avisarle al componente padre
    if (onSave) {
      onSave(respuesta.data); // Le pasas los datos nuevos que devolvió el backend
    }

  } catch (error) {
    console.error("Error al guardar los cambios con Axios:", error.response?.data || error.message);
    alert("Hubo un error al guardar los cambios");
  }
}


  return (
    
    <div className="edit-profile-page">
      <Navbar />
      <div className="edit-profile__topbar">
        <button
          type="button"
          className="icon-button"
          onClick={onCancel}
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="edit-profile__title">Editar Perfil</h1>
      </div>

      <form className="section-wrapper" onSubmit={handleSubmit}>
        <div className="card">
          {/* Avatar */}
          <div className="edit-profile__avatar-section">
            <div className="edit-profile__avatar-wrapper">
              <img
                src={avatarPreview}
                alt="Vista previa de foto de perfil"
                style={{ width: 120, height: 120, objectFit: "cover" }}
                className="edit-profile__avatar"
                
              />
              <p> </p>
              <label
                htmlFor="avatar-upload"
                className="edit-profile__avatar-edit"
                aria-label="Cambiar foto de perfil"
              >
                <Camera size={13} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="visually-hidden"
              />
            </div>
            <p className="edit-profile__avatar-hint">
              Tocá el ícono para cambiar tu foto
            </p>
          </div>

          {/* Datos personales */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de usuario
            </label>
            <div className="form-input-prefix">
              <span>@</span>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input form-input--prefixed"
                value={formData.username}
                onChange={handleChange}
                placeholder="usuario10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="about" className="form-label">
              Sobre mí
            </label>
            <textarea
              id="about"
              name="about"
              className="form-textarea"
              value={formData.about}
              onChange={handleChange}
              placeholder="Contales a los demás jugadores algo sobre vos"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age" className="form-label">
                Edad
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="playingSince" className="form-label">
                Jugando desde los (años)
              </label>
              <input
                id="playingSince"
                name="playingSince"
                type="number"
                min="1"
                className="form-input"
                value={formData.playingSince}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Ubicación
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ciudad, País"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position" className="form-label">
              Posición favorita
            </label>
            <select
              id="position"
              name="position"
              className="form-select"
              value={formData.position}
              onChange={handleChange}
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Acciones */}
        <div className="edit-profile__actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            <Save size={18} />
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}