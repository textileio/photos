import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

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
    marginVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'space-around'
  },
  message: {
    fontFamily: 'BentonSans',
    color: Colors.charcoal,
    paddingTop: 20,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'justify'
  }
})
