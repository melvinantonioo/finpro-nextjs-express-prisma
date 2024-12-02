"use client"
import { useEffect, useState } from "react";
import useAuthStore from "@/stores/auth-stores";
import axiosInstance from "@/lib/axiosInstance";
import ProfileCard from "./components/cards";
import PointsAndVouchers from "./components/pointAndVoucher";
import Refferal, { IReff } from "./components/refferal";

interface IUserFetch {
    id: number;
    name: string;
    email: string;
    profilePicture?: string
};

const ProfilePage = () => {
    const { user } = useAuthStore();
    const [points, setPoints] = useState<number>(0);
    const [vouchers, setVouchers] = useState([]);
    const [userFetch, setUserfetch] = useState<IUserFetch>();
    const [refferal, setRefferal] = useState<string>()

    console.log(user);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return; // Tambahkan pengecekan jika user null
            try {
                const { data: pointsData } = await axiosInstance.get("/point/userpoints");
                setPoints(pointsData.points);
                console.log(`Jumlah Point`, pointsData);

                const { data: vouchersData } = await axiosInstance.get("/point/vouchers");
                setVouchers(vouchersData.vouchers);

                const { data: userData } = await axiosInstance.get("/auth/user");
                setUserfetch(userData.name)

                const { data: userRefferal } = await axiosInstance.get("/point/refferal");
                console.log("Referral Code API Response:", userRefferal.referralCode);
                setRefferal(userRefferal.referralCode)
                // console.log(`Refferal`, userRefferal);

            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, [user]);

    if (!user) {
        // Jika user null, tampilkan placeholder atau redirect ke login
        return <p className="text-center">Loading profile...</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <ProfileCard user={user} />
            <Refferal refferal={refferal || "Loading.."} />
            <PointsAndVouchers points={points} vouchers={vouchers} />
        </div>
    );
};

export default ProfilePage;