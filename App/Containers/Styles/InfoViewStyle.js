import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes'

export const buttonColor1 = Colors.brandPink
export const buttonColor2 = Colors.brandYellow
export const buttonColor3 = Colors.brandRed
export const buttonColor4 = Colors.brandBlue

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    padding: 20
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  iconsRow: {
    flexDirection: 'row',
    marginTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'space-around'
  },
  message: {
    fontFamily: 'BentonSans',
    color: '#9b9b9b',
    paddingTop: 20,
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 20,
    alignSelf: 'center',
    textAlign: 'justify'
  }
})
