import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  navHeader: {
    // remove the border in this case
    backgroundColor: 'white',
    borderBottomWidth: 0
  },
  gridContainer: {
    flex: 1,
    backgroundColor: '#FAFCFE'
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
