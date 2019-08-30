import React from 'react'

import OnboardingContainer from './onboarding-container'
import InitializeNew from './initialize-new'
import Username from './username'
import SetAvatar from '../SetAvatar'
import MailSignup from './mail-list-signup'

export default function onboardingNew() {
  return (
    <OnboardingContainer>
      <InitializeNew />
      <Username />
      <SetAvatar />
      <MailSignup />
    </OnboardingContainer>
  )
}
