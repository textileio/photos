import React from 'react'
import { View } from 'react-native'

import Step1 from './Step1'
import Step2 from './Step2'

const SignUp = props => {
  const { step } = props

  switch (step) {
    case 0: {
      return <Step1 {...props} />
    }

    case 1: {
      return <Step2 {...props} />
    }

    default:
      return <View />
  }
}

export default SignUp
