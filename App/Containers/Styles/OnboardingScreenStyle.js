import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export const buttonColor = Colors.brandRed

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  welcomeContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    padding: 20
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  header: {
    fontFamily: 'Biotif-BoldItalic',
    color: Colors.brandBlue,
    fontSize: 20,
    textAlign: 'center'
  },
  imageView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50%'
  },
  imageIcon: {
    width: 200,
    height: 200
  },
  message: {
    fontFamily: 'Biotif-Regular',
    color: Colors.charcoal,
    paddingTop: 20,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'justify'
  }
})
