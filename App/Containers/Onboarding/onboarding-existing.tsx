import React from 'react'

import OnboardingContainer from './onboarding-container'
import InitializeExisting from './initialize-existing'
import MailSignup from './mail-list-signup'

export default function onboardingExisting() {
  return (
    <OnboardingContainer>
      <InitializeExisting />
      <MailSignup />
    </OnboardingContainer>
  )
}
