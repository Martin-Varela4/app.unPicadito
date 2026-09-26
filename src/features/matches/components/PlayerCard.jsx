import React from 'react';

export const PlayerCard = ({ player, type = 'confirmed' }) => {
    const isConfirmed = type === 'confirmed';
    const bgColor = isConfirmed ? 'bg-green-50/50 border-green-100' : 'bg-amber-50/50 border-amber-100';
    const borderColor = isConfirmed ? 'border-green-200' : 'border-amber-200';

    return (
        <div className={`flex items-center gap-3 p-2.5 border rounded-lg ${bgColor}`}>
            <img
                src={player.profilePictureUrl || "https://via.placeholder.com/40"}
                alt={player.username}
                className={`w-10 h-10 rounded-full object-cover border ${borderColor}`}
            />
            <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {player.firstName} {player.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    @{player.username} • <span className="font-semibold">{player.mainPosition}</span>
                </p>
            </div>
        </div>
    );
};