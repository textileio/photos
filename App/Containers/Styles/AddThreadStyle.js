import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import { Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  textInput: {
    fontSize: 17,
    fontFamily: 'BentonSans',
    color: Colors.charcoal,
    margin: 16
  }
})
