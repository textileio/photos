import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  text: {
    ...BentonSansBold(),
    fontSize: 13,
  },
})

export const colors = {
  Weak: {
    color: '#D0021B'
  },
  Strong: {
    color: '#6FC110'
  },
  Normal: {
    color: '#FACF03'
  }
}