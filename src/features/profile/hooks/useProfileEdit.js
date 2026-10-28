import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { getMyProfile, updateMyProfile } from '../services/profileService';
import {
  INITIAL_PROFILE_FORM_VALUES,
  INITIAL_PROFILE_PASSWORD_VALUES,
  DEFAULT_PLAYER_POSITION,
} from '../constants/profileConstants';
import { getProfileSchema } from '../schemas/profileSchema';
import { validateWithSchema } from '../../../utils/validation';

export const useProfileEdit = (options = {}) => {
  const { onCancel, onSave } = options;
  const navigate = useNavigate();
  const updateUser = useAuthStore((state) => state.updateUser);

  const [formData, setFormData] = useState(INITIAL_PROFILE_FORM_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((user) => {
        if (!active) return;
        setFormData({
          ...INITIAL_PROFILE_FORM_VALUES,
          nombreUsuario: user.nombreUsuario ?? '',
          nombre: user.nombre ?? '',
          apellido: user.apellido ?? '',
          apodo: user.apodo ?? '',
          fotoPerfilUrl: user.fotoPerfilUrl ?? '',
          posicionPrincipal: user.posicionPrincipal ?? DEFAULT_PLAYER_POSITION,
        });
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'No se pudo cargar el perfil.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: '' }));
    setError('');
  };

  const handlePasswordToggle = (event) => {
    setChangePassword(event.target.checked);
    setFormData((previous) => ({
      ...previous,
      ...INITIAL_PROFILE_PASSWORD_VALUES,
    }));
    setFieldErrors((previous) => {
      const copy = { ...previous };
      delete copy.currentPassword;
      delete copy.password;
      delete copy.passwordConfirm;
      return copy;
    });
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const schema = getProfileSchema(changePassword);
    const { isValid, data, errors } = await validateWithSchema(schema, formData);

    if (!isValid) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const profileData = {
      nombreUsuario: data.nombreUsuario.trim(),
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      apodo: data.apodo ? data.apodo.trim() : null,
      fotoPerfilUrl: data.fotoPerfilUrl ? data.fotoPerfilUrl.trim() : null,
      posicionPrincipal: data.posicionPrincipal,
    };

    if (changePassword) {
      profileData.currentPassword = data.currentPassword;
      profileData.password = data.password;
      profileData.passwordConfirm = data.passwordConfirm;
    }

    setSaving(true);
    try {
      const response = await updateMyProfile(profileData);
      const updatedUser = response.user ?? response.data?.user ?? response;
      updateUser(updatedUser);
      onSave?.(updatedUser);
      navigate('/profile', { replace: true });
    } catch (saveError) {
      setError(saveError.message || 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/profile');
    }
  };

  return {
    formData,
    fieldErrors,
    loading,
    saving,
    changePassword,
    error,
    handleChange,
    handlePasswordToggle,
    handleSubmit,
    handleCancel,
  };
};

export default useProfileEdit;
