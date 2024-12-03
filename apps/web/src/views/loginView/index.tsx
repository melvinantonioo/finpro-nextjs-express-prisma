import React from 'react'
import LoginForm from './components/loginForm'
import { HomeLayouts } from '@/layouts/homeLayouts'

export default function LoginView() {
    return (
        <HomeLayouts>
            <LoginForm />
        </HomeLayouts>
    )
}
