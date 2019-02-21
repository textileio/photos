import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'

import { color } from '../../styles'

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
    backgroundColor: color.screen_primary
  }
})
