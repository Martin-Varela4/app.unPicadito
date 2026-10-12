import { useState } from 'react';
import defaultUserAvatar from '../../assets/usuario.png';

export default function Avatar({ src, alt, className = '' }) {
    const imageSrc = src || defaultUserAvatar;
    const [failedSource, setFailedSource] = useState(null);
    const displayedSrc = failedSource === imageSrc ? defaultUserAvatar : imageSrc;

    return (
        <img
            src={displayedSrc}
            alt={alt}
            className={className}
            onError={() => setFailedSource(imageSrc)}
        />
    );
}
