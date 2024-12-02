import AdminHome from '@/components/adminDashboard/home'
import AdminLayout from '@/layouts/adminLayouts'
import React from 'react'

export default function AdminHomeView() {
    return (
        <AdminLayout>
            <AdminHome />
        </AdminLayout>
    )
}
