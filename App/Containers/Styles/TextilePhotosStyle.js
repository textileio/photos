import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  bottomOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  overlayText: {
    color: 'white',
    fontFamily: 'BentonSans'
  }
})
