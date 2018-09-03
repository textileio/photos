import { Platform } from 'react-native'

export const BentonSansBold = () => {
  if (Platform.OS === 'android') {
    return {
      fontFamily: 'BentonSans Bold'
    }
  } else {
    return {
      fontFamily: 'BentonSans',
      fontWeight: '700'
    }
  }
}
