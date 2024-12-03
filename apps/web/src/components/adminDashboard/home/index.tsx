"use client"

import CardItem from '@/components/adminDashboard/home/cards';
import useAuthStore from '@/stores/auth-stores';


const AdminHome: React.FC = () => {
    const { user, clearAuth } = useAuthStore(); 
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Hi-hello,{user?.name} </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardItem
                    title="Create faster with AI"
                    description="Answer a few questions to generate an event that's ready to publish in minutes."
                    imageSrc="/path/to/image1.jpg"
                    link="/create-with-ai"
                />
                <CardItem
                    title="Start from scratch"
                    description="Craft every detail from ticket types to reserved seating and more advanced tools."
                    imageSrc="/path/to/image2.jpg"
                    link="/admin/create"
                />
            </div>
        </div>
    );
};

export default AdminHome;