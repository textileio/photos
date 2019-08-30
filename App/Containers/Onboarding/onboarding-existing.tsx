import React from 'react'

import OnboardingContainer from './onboarding-container'
import InitializeExisting from './initialize-existing'
import OnboardingUsername from './OnboardingUsername'
import SetAvatar from '../SetAvatar'
import MailSignup from './MailListSignupScreen'

export default function onboardingExisting() {
  return (
    <OnboardingContainer>
      <InitializeExisting />
      <OnboardingUsername />
      <SetAvatar />
      <MailSignup />
    </OnboardingContainer>
  )
}
