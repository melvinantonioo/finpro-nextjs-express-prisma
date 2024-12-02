import React from "react";

interface ProfileCardProps {
    user: {
        id: number;
        name: string;
        email: string;
        profilePicture?: string
    };
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
    if (!user) {
        return <div>Loading user profile...</div>; // Placeholder untuk null user
    }
    return (
        <div className="bg-white p-6 rounded shadow-md flex items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
                {user?.profilePicture ? (
                    <img
                        src={user.profilePicture}
                        alt={`${user.name}'s profile`}
                        className="rounded-full"
                    />
                ) : (
                    <span>{getInitials(user.name)}</span>
                )}
            </div>
            <div className="ml-4">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
            </div>
        </div>
    );
};

export default ProfileCard;
