import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  safeContainerTop: {
    backgroundColor: '#FAFCFE'
  },
  safeContainerBottom: {
    flex: 1,
    backgroundColor: 'white'
  },
  onBoardingContainer: {
    paddingTop: 115,
    paddingHorizontal: 20,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  footerContainer: {
    paddingHorizontal: 24,
    borderTopColor: '#EFEFEF',
    borderTopWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 62
  },
  skipLink: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    color: '#000000'
  },
  nextLink: {
    ...BentonSansBold(),
    fontSize: 18,
    color: '#2625FF'
  },
  subtitle: {
    fontFamily: 'BentonSans',
    fontSize: 18,
    color: '#4A4A4A',
    lineHeight: 28
  },
  dotsContainer: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  dot: {
    width: 20,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#d8d8d8'
  },
  dotActive: {
    width: 42,
    height: 5,
    borderRadius: 3
  },
  imageContainer: {
    marginBottom: 38
  },
  titleContainer: {
    marginBottom: 17
  },
  title: {
    ...BentonSansBold(),
    fontSize: 24,
    color: '#000000'
  }
})
