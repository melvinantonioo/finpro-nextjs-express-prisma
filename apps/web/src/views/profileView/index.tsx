
import ProfilePageComponent from '@/components/profiles'
import { HomeLayouts } from '@/layouts/homeLayouts'
import React from 'react'

export default function ProfileView() {
    return (
        <HomeLayouts>
            <ProfilePageComponent />
        </HomeLayouts>
    )
}
