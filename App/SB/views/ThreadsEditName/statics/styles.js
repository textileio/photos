import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: color.screen_primary,
    flex: 1
  },
  contentContainer: {
    paddingTop: 22,
    paddingHorizontal: 24
  },
  toolbarLeft: {
    height: 16,
    width: 40
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  link: {
    ...BentonSansBold(),
    fontSize: 16,
    color: '#2625ff'
  },
  labelStyle: {
    color: '#9b9b9b',
    fontSize: 16
  }
})
