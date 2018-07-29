import {StyleSheet} from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  headerContainer: {
    marginBottom: 27
  },
  logo: {
    marginBottom: 40
  },
  logoStep2: {
    marginBottom: 26,
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 36
  },
  link: {
    fontFamily: "BentonSans",
    fontSize: 16,
    color: '#2625ff',
    textDecorationLine: 'underline'
  },
  title: {
    fontFamily: "BentonSans",
    fontSize: 20,
    lineHeight: 25,
  },
  subtitle: {
    fontFamily: "BentonSans",
    fontSize: 16,
    lineHeight: 27,
    textAlign: 'center',
    marginBottom: 25
  },
  strong: {
    ...BentonSansBold(),
  },
  uploadIcon: {
    marginBottom: 18
  },
  uploadContainer: {
    alignItems: 'center'
  },
  photoUploaded: {
    marginBottom: 40
  },
  uploadButton: {
    marginBottom: 35
  }
})
