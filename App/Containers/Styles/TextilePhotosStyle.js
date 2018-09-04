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
  }
})
