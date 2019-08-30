import React from 'react'

import OnboardingContainer from './onboarding-container'
import InitializeNew from './initialize-new'
import OnboardingUsername from './OnboardingUsername'
import SetAvatar from '../SetAvatar'
import MailSignup from './MailListSignupScreen'

export default function onboardingNew() {
  return (
    <OnboardingContainer>
      <InitializeNew />
      <OnboardingUsername />
      <SetAvatar />
      <MailSignup />
    </OnboardingContainer>
  )
}
