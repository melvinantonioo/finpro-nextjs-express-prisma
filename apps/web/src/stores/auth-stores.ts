import { create } from "zustand";
import { deleteCookie } from "cookies-next";

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: string;
    profilePicture?: string; 
}

interface IAuthStore {
    user: IUser | null;
    onAuthSuccess: (user: IUser | null) => void;
    clearAuth: () => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
    user: null,  
    onAuthSuccess: (payload) => set(() => ({ user: payload })),

    clearAuth: () => { //kemudian ini akan set user menjadi null lagi , setelah logout
        set(() => ({ user: null }));
        deleteCookie("access_token"); //delete token dari cookie 
    },
}));

//state ini sementara , yang membuat data nya muncul terus , karnna token nya di decode lagi dan dimasukan lagi ke client, dengan bantuan <AuthProvider>

export default useAuthStore;
