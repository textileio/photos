import React from 'react'
import Step1 from './Step1'
import Step2 from './Step2'

const UserOnBoarding = props => {
  const { profilePictureData } = props
  if (profilePictureData) {
    return <Step2 {...props} />
  } else {
    return <Step1 {...props} />
  }
}

export default UserOnBoarding
