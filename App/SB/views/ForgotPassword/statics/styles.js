import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 36
  },
  headerText: {
    fontFamily: 'Biotif-Regular',
    fontSize: 16,
    lineHeight: 25
  },
  link: {
    ...BentonSansBold(),
    color: '#2625ff'
  },
  button: {
    marginTop: 8
  },
  bottomLine: {
    alignItems: 'center'
  },
  footerText: {
    fontFamily: 'Biotif-Regular',
    fontSize: 13,
    color: '#6d6d6d'
  },
  footerLink: {
    fontFamily: 'Biotif-Regular',
    fontSize: 13,
    textDecorationLine: 'underline'
  }
})
