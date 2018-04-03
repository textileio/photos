import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  header: {
    paddingTop: 30,
    fontWeight: 'bold',
    fontSize: 42,
    alignSelf: 'center',
    textAlign: 'center',
  },
  imageView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70,
  },
  imageIcon: {
    width: 200,
    height: 200, 
  },
  message: {
    width: 300,
    fontSize: 24,
    textAlign: 'center',
  },
})
