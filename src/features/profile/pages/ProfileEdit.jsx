import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/useAuthStore";
import Button from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Switch from "../../../components/ui/Switch";
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
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((user) => {
        if (!active) return;
        setFormData({
          ...emptyForm,
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

  function handlePasswordToggle(event) {
    setChangePassword(event.target.checked);
    setFormData((previous) => ({
      ...previous,
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (changePassword) {
      if (!formData.currentPassword || !formData.password || !formData.passwordConfirm) {
        setError("Completá la contraseña actual, la nueva y su confirmación.");
        return;
      }
      if (formData.password.length < 6) {
        setError("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (formData.password !== formData.passwordConfirm) {
        setError("La nueva contraseña y su confirmación no coinciden.");
        return;
      }
    }

    const profileData = {
      nombreUsuario: formData.nombreUsuario,
      nombre: formData.nombre,
      apellido: formData.apellido,
      apodo: formData.apodo,
      fotoPerfilUrl: formData.fotoPerfilUrl.trim() || null,
      posicionPrincipal: formData.posicionPrincipal,
    };
    if (changePassword) {
      profileData.currentPassword = formData.currentPassword;
      profileData.password = formData.password;
      profileData.passwordConfirm = formData.passwordConfirm;
    }

    setSaving(true);
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
    <main className="min-h-screen bg-[var(--color-background-main)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            className="h-11 w-11 shrink-0 rounded-full p-0"
            onClick={cancel}
            aria-label="Volver"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Button>
          <h1 className="min-w-0 text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
            Editar Perfil
          </h1>
        </header>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8">
              {loading ? (
                <p className="py-12 text-center text-sm text-slate-300" role="status">
                  Cargando perfil...
                </p>
              ) : (
                <>
                  <div className="mb-7 flex flex-col items-center text-center">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-[3px] border-[var(--color-border-subtle)] shadow-md">
                      {formData.fotoPerfilUrl ? (
                        <img
                          src={formData.fotoPerfilUrl}
                          alt="Vista previa de foto de perfil"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--color-brand-primary)] text-2xl font-bold text-[#21263A]">
                          {formData.nombre.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                      Pegá la URL pública de una imagen para cambiar tu foto
                    </p>
                  </div>

                  <div className="flex min-w-0 w-full flex-col gap-1.5">
                    <label htmlFor="nombreUsuario" className="text-sm font-medium text-slate-300">
                      Nombre de usuario <span className="text-red-500">*</span>
                    </label>
                    <div className="flex min-h-11 min-w-0 items-center rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] transition-colors focus-within:border-[var(--color-brand-primary)] focus-within:ring-1 focus-within:ring-[var(--color-brand-primary)]">
                      <span className="pl-3.5 text-sm text-slate-400" aria-hidden="true">@</span>
                      <input
                        id="nombreUsuario"
                        name="nombreUsuario"
                        type="text"
                        className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-400"
                        value={formData.nombreUsuario}
                        onChange={handleChange}
                        placeholder="usuario10"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
                    <Input
                      label="Nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      autoComplete="given-name"
                      required
                    />
                    <Input
                      label="Apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      autoComplete="family-name"
                      required
                    />
                  </div>

                  <Input
                    label="Apodo"
                    name="apodo"
                    value={formData.apodo}
                    onChange={handleChange}
                    placeholder="Tu apodo (opcional)"
                  />

                  <Input
                    label="Foto de perfil"
                    name="fotoPerfilUrl"
                    type="url"
                    value={formData.fotoPerfilUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                  <Select
                    label="Posición hábil"
                    name="posicionPrincipal"
                    value={formData.posicionPrincipal}
                    onChange={handleChange}
                    options={positions}
                  />

                  <section className="space-y-5 border-t border-[var(--color-border-subtle)] pt-5 sm:space-y-6 sm:pt-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">Cambiar contraseña</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Dejá los campos vacíos si no querés modificarlos.
                      </p>
                    </div>
                    <Switch
                      label="Quiero cambiar mi contraseña"
                      checked={changePassword}
                      onChange={handlePasswordToggle}
                    />
                    {changePassword && (
                      <>
                        <Input
                          label="Contraseña actual"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          autoComplete="current-password"
                          required
                        />
                        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
                          <Input
                            label="Nueva contraseña"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={6}
                            autoComplete="new-password"
                            required
                          />
                          <Input
                            label="Repetir nueva contraseña"
                            name="passwordConfirm"
                            type="password"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            minLength={6}
                            autoComplete="new-password"
                            required
                          />
                        </div>
                      </>
                    )}
                  </section>
                </>
              )}
              {error && (
                <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm font-medium text-red-300" role="alert">
                  {error}
                </p>
              )}
            </CardContent>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border-subtle)] p-4 sm:flex-row sm:justify-end sm:p-6 md:px-8">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={cancel}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full gap-2 sm:w-auto"
                disabled={loading || saving}
              >
                <Save size={18} aria-hidden="true" />
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </main>
  );
}
