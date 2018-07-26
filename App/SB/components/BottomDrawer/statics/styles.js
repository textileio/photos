import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 5
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'relative',
    height,
    width
  },
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 100,
    width
  }
})