import { Dimensions, StyleSheet } from 'react-native'
const { width } = Dimensions.get('window')

export const gridStyles = photos => ({
  grid: {
    container: {
      maxHeight: 20 * photos.length
    },
    photo: (width - 25) / 4
  },
  list: {
    container: {},
    photo: width - 10
  }
})

export default StyleSheet.create({
  photoList: {
    flexWrap: 'wrap'
  },
  photo: {
    marginLeft: 5,
    marginBottom: 5,
    backgroundColor: 'red'
  },
  photoSelected: {
    backgroundColor: '#2625FF',
    opacity: 0.4,
    zIndex: 100,
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  photoSelectedIcon: {
    height: 12,
    width: 12,
    position: 'absolute',
    zIndex: 100,
    right: 4,
    top: 4
  }
})
