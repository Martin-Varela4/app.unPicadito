import Spinner from './Spinner';

export default function LoadingState({
    label = 'Cargando...',
    size = 'md',
    className = 'py-12',
    ...props
}) {
    return (
        <div className={`flex flex-col items-center justify-center text-slate-300 ${className}`.trim()} {...props}>
            <Spinner size={size} label={label} />
        </div>
    );
}
