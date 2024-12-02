import EventsFilter from '@/components/adminDashboard/events'
import AdminLayout from '@/layouts/adminLayouts'
import React from 'react'

export default function EventView() {
    return (
        <AdminLayout>
            <EventsFilter />
        </AdminLayout>
    )
}
