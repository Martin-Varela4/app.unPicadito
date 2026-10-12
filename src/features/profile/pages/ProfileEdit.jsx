import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { getMyProfile, updateMyProfile } from "../services/profile.service";

const positions = [
  { value: "ARQUERO", label: "Arquero" },
  { value: "DEFENSOR", label: "Defensor" },
  { value: "MEDIOCAMPISTA", label: "Mediocampista" },
  { value: "DELANTERO", label: "Delantero" },
  { value: "TODOTERRENO", label: "Todoterreno" },
  { value: "POLIFUNCIONAL", label: "Polifuncional" },
];

const emptyForm = {
  email: "",
  nombreUsuario: "",
  nombre: "",
  apellido: "",
  apodo: "",
  fotoPerfilUrl: "",
  posicionPrincipal: "POLIFUNCIONAL",
  currentPassword: "",
  password: "",
  passwordConfirm: "",
};

export default function EditProfileForm({ onCancel, onSave }) {
  const navigate = useNavigate();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((user) => {
        if (!active) return;
        setFormData({
          ...emptyForm,
          email: user.email ?? "",
          nombreUsuario: user.nombreUsuario ?? "",
          nombre: user.nombre ?? "",
          apellido: user.apellido ?? "",
          apodo: user.apodo ?? "",
          fotoPerfilUrl: user.fotoPerfilUrl ?? "",
          posicionPrincipal: user.posicionPrincipal ?? "POLIFUNCIONAL",
        });
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "No se pudo cargar el perfil.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const profileData = { ...formData };
    const isChangingPassword = Boolean(
      profileData.currentPassword || profileData.password || profileData.passwordConfirm,
    );
    if (!isChangingPassword) {
      delete profileData.currentPassword;
      delete profileData.password;
      delete profileData.passwordConfirm;
    } else if (
      !profileData.currentPassword
      || !profileData.password
      || !profileData.passwordConfirm
    ) {
      setError("Completá la contraseña actual, la nueva y su confirmación.");
      setSaving(false);
      return;
    }
    profileData.fotoPerfilUrl = profileData.fotoPerfilUrl.trim() || null;

    try {
      const response = await updateMyProfile(profileData);
      updateUser(response.user);
      onSave?.(response.user);
      navigate("/profile", { replace: true });
    } catch (saveError) {
      setError(saveError.message || "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  }

  const cancel = onCancel || (() => navigate("/profile"));

  return (
    <div className="edit-profile-page">
      <div className="edit-profile__topbar">
        <button
          type="button"
          className="icon-button"
          onClick={cancel}
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="edit-profile__title">Editar Perfil</h1>
      </div>

      <form className="section-wrapper" onSubmit={handleSubmit}>
        <div className="card">
          {loading ? (
            <p role="status">Cargando perfil...</p>
          ) : (
            <>
              <div className="edit-profile__avatar-section">
                <div className="edit-profile__avatar-wrapper">
                  {formData.fotoPerfilUrl ? (
                    <img
                      src={formData.fotoPerfilUrl}
                      alt="Vista previa de foto de perfil"
                      className="edit-profile__avatar"
                    />
                  ) : (
                    <div className="edit-profile__avatar edit-profile__avatar-placeholder">
                      {formData.nombre.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <p className="edit-profile__avatar-hint">
                  Pegá la URL pública de una imagen para cambiar tu foto
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombreUsuario" className="form-label">
                  Nombre de usuario
                </label>
                <div className="form-input-prefix">
                  <span>@</span>
                  <input
                    id="nombreUsuario"
                    name="nombreUsuario"
                    type="text"
                    className="form-input form-input--prefixed"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                    placeholder="usuario10"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    className="form-input"
                    value={formData.nombre}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido" className="form-label">Apellido</label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    className="form-input"
                    value={formData.apellido}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="apodo" className="form-label">Apodo</label>
                <input
                  id="apodo"
                  name="apodo"
                  type="text"
                  className="form-input"
                  value={formData.apodo}
                  onChange={handleChange}
                  placeholder="Tu apodo (opcional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fotoPerfilUrl" className="form-label">
                  Foto de perfil
                </label>
                <input
                  id="fotoPerfilUrl"
                  name="fotoPerfilUrl"
                  type="url"
                  className="form-input"
                  value={formData.fotoPerfilUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="posicionPrincipal" className="form-label">
                  Posición hábil
                </label>
                <select
                  id="posicionPrincipal"
                  name="posicionPrincipal"
                  className="form-select"
                  value={formData.posicionPrincipal}
                  onChange={handleChange}
                >
                  {positions.map((position) => (
                    <option key={position.value} value={position.value}>
                      {position.label}
                    </option>
                  ))}
                </select>
              </div>

              <hr />
              <h2 className="form-section-title">Cambiar contraseña</h2>
              <p className="edit-profile__avatar-hint">
                Dejá los campos vacíos si no querés modificarlos.
              </p>
              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">
                  Contraseña actual
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="form-input"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Nueva contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="passwordConfirm" className="form-label">
                    Repetir nueva contraseña
                  </label>
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    className="form-input"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>

        <div className="edit-profile__actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={cancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading || saving}>
            <Save size={18} />
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
