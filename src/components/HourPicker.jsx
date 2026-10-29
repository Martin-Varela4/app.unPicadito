import Select from './ui/Select';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export default function HourPicker({
  value,
  onChange,
  disabled = false,
  error = null,
  label = 'Hora (en punto)',
  name = 'hora',
  className = '',
  ...props
}) {
  return (
    <Select
      id={name}
      name={name}
      label={label}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      error={error}
      options={HOUR_OPTIONS}
      className={className}
      {...props}
    />
  );
}
