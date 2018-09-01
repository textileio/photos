import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 36
  },
  forgotText: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    color: '#6d6d6d',
    marginBottom: 29,
    marginTop: 10,
    textAlign: 'right'
  },
  headerText: {
    fontFamily: 'BentonSans',
    fontSize: 16,
    lineHeight: 25
  },
  link: {
    ...BentonSansBold(),
    color: '#2625ff'
  },
  bottomLine: {
    marginTop: 32,
    alignItems: 'center'
  },
  footerText: {
    fontFamily: 'BentonSans',
    fontSize: 13,
    color: '#6d6d6d'
  },
  footerLink: {
    fontFamily: 'BentonSans',
    fontSize: 13,
    textDecorationLine: 'underline',
    padding: 10
  }
})
