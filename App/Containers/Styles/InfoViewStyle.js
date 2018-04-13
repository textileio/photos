import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  navigationBar: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: Colors.transparent,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  navigationIcon: {
    flex: 1,
    // position: 'relative',
    flexDirection: 'row',
    color: Colors.frost,
    backgroundColor: Colors.transparent,
  }
})
