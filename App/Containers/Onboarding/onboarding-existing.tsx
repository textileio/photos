import React from 'react'

import OnboardingContainer from './onboarding-container'
import InitializeExisting from './initialize-existing'
import MailSignup from './MailListSignupScreen'

export default function onboardingExisting() {
  return (
    <OnboardingContainer>
      <InitializeExisting />
      <MailSignup />
    </OnboardingContainer>
  )
}
