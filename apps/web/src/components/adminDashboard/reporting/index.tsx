import React from 'react'
import DashboardGraph from './components/salesReport'
import OrganizerStats from './components/organizerStats'

export default function ReportPage() {
    return (
        <div>
            <div className="p-6 bg-gray-50 ">
                <OrganizerStats />
            </div>
            <DashboardGraph />
        </div>
    )
}
