import { ArrowLeft, Save } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Switch from "../../../components/ui/Switch";
import PageContainer from "../../../components/ui/PageContainer";
import FormActions from "../../../components/ui/FormActions";
import LoadingState from "../../../components/ui/LoadingState";
import ErrorAlert from "../../../components/ui/ErrorAlert";
import { useProfileEdit } from "../hooks/useProfileEdit";
import { PLAYER_POSITIONS } from "../constants/profileConstants";

export default function ProfileEdit({ onCancel, onSave }) {
  const {
    formData, fieldErrors, loading, saving, changePassword, error,
    handleChange, handlePasswordToggle, handleSubmit, handleCancel,
  } = useProfileEdit({ onCancel, onSave });

  if (loading) {
    return <LoadingState label="Cargando perfil..." className="py-20" />;
  }

  return (
    <PageContainer size="md">
      <Button
        type="button"
        variant="ghost"
        onClick={handleCancel}
        className="mb-4 gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al perfil
      </Button>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-4 sm:p-6 md:p-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Actualizá tus datos personales y preferencias de juego
              </p>
            </div>

            {/* Datos Básicos */}
            <div className="space-y-4">
              <h2 className="border-b border-[var(--color-border-subtle)] pb-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
                Información Básica
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Nombre de usuario" name="nombreUsuario"
                  value={formData.nombreUsuario} onChange={handleChange}
                  error={fieldErrors.nombreUsuario} placeholder="usuario123" required
                />
                <Input
                  label="Apodo" name="apodo"
                  value={formData.apodo} onChange={handleChange}
                  error={fieldErrors.apodo} placeholder="El Tanque"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Nombre" name="nombre"
                  value={formData.nombre} onChange={handleChange}
                  error={fieldErrors.nombre} placeholder="Juan" required
                />
                <Input
                  label="Apellido" name="apellido"
                  value={formData.apellido} onChange={handleChange}
                  error={fieldErrors.apellido} placeholder="Pérez" required
                />
              </div>

              <Input
                label="URL Foto de Perfil" name="fotoPerfilUrl"
                value={formData.fotoPerfilUrl} onChange={handleChange}
                error={fieldErrors.fotoPerfilUrl} placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>

            {/* Preferencias de Juego */}
            <div className="space-y-4">
              <h2 className="border-b border-[var(--color-border-subtle)] pb-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
                Preferencias de Juego
              </h2>
              <Select
                label="Posición Principal" name="posicionPrincipal"
                value={formData.posicionPrincipal} onChange={handleChange}
                options={PLAYER_POSITIONS} error={fieldErrors.posicionPrincipal}
              />
            </div>

            {/* Cambio de Contraseña */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">Seguridad</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Cambiá tu contraseña de acceso</p>
                </div>
                <Switch checked={changePassword} onChange={handlePasswordToggle} label="Cambiar contraseña" />
              </div>

              {changePassword && (
                <div className="space-y-4 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-main)]/50 p-4">
                  <Input
                    label="Contraseña Actual" name="currentPassword" type="password"
                    value={formData.currentPassword} onChange={handleChange}
                    error={fieldErrors.currentPassword} placeholder="••••••••" required
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Nueva Contraseña" name="password" type="password"
                      value={formData.password} onChange={handleChange}
                      error={fieldErrors.password} placeholder="Mínimo 6 caracteres" required
                    />
                    <Input
                      label="Confirmar Nueva Contraseña" name="passwordConfirm" type="password"
                      value={formData.passwordConfirm} onChange={handleChange}
                      error={fieldErrors.passwordConfirm} placeholder="Repetí la contraseña" required
                    />
                  </div>
                </div>
              )}
            </div>

            {error && <ErrorAlert message={error} />}
          </CardContent>

          <FormActions
            onCancel={handleCancel}
            cancelText="Cancelar"
            submitText="Guardar Cambios"
            submitIcon={<Save className="h-4 w-4" />}
            isLoading={saving}
            className="p-4 sm:p-6 md:px-8"
          />
        </form>
      </Card>
    </PageContainer>
  );
}
