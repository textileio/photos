import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    fontFamily: 'BentonSans',
    color: Colors.charcoal
  },
  button: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandBlue
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'BentonSans-Bold',
    color: 'white',
    alignSelf: 'center'
  }
})
