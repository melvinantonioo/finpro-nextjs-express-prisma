import ProfilePage from '@/app/profiles/page'
import { HomeLayouts } from '@/layouts/homeLayouts'
import React from 'react'

export default function ProfileView() {
    return (
        <HomeLayouts>
            <ProfilePage />
        </HomeLayouts>
    )
}
