import React from 'react'
import RegisterForm2 from './components/regisForm'
import { HomeLayouts } from '@/layouts/homeLayouts'
import SocialLogin from './components/socialLogin'

export default function RegisView() {
  return (
    <HomeLayouts>
      <RegisterForm2 />
      <SocialLogin />
    </HomeLayouts>
  )
}
