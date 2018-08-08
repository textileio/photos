import {StyleSheet} from 'react-native'
import {BentonSansBold} from '../../../util/fonts'

export default StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 36,
  },
  headerText: {
    fontFamily: 'BentonSans',
    fontSize: 16,
    lineHeight: 25,
  },
  bottomLine: {
    marginTop: 32,
    alignItems: 'center'
  },
  bottomLineText: {
    fontFamily: 'BentonSans',
    fontSize: 10,
    lineHeight: 24,
    color: '#000000'
  },
  bottomLineLink: {
    fontFamily: 'BentonSans',
    fontSize: 10,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 16
  },
  link: {
    color: '#2625ff'
  },
  strong: {
    ...BentonSansBold(),
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
