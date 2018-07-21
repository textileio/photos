import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: Metrics.navBarHeight,
    // backgroundColor: Colors.brandPink
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.frost
  },
  listItem: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'BentonSans',
    color: Colors.charcoal,
    alignSelf: 'center'
  },
  button: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandBlue
  },
  buttonDisabled: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandBlue,
    opacity: 0.3
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'BentonSans-Bold',
    color: 'white',
    alignSelf: 'center'
  }
})
