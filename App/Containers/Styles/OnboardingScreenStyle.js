import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  header: {
    fontFamily: 'Biotif-ExtraBoldItalic',
    paddingTop: '25%',
    // fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'center',
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
    paddingTop: '5%',
    width: '80%',
    fontSize: 22,
    alignSelf: 'center',
    textAlign: 'justify'
  }
})
