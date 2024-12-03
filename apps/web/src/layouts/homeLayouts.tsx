import Footer from '@/components/Footer';
import NavbarHome from '@/components/Header';
import React from 'react'
import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export const HomeLayouts: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div>
            <NavbarHome />
            {children}
            <Footer />
        </div>
    )
}