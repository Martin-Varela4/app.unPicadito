import Alert from './Alert';

export default function ErrorAlert({ children, message, icon, className = '', ...props }) {
    return (
        <Alert variant="error" icon={icon} className={className} message={message} {...props}>
            {children}
        </Alert>
    );
}
