import { StyleSheet } from 'react-native'

import { color } from '../../../styles'

export default StyleSheet.create({
  container: {
    backgroundColor: color.screen_primary,
    flex: 1
  },
  toast: {
    backgroundColor: '#EEF0F3'
  },
  toastText: {
    color: '#2D3237',
    textAlign: 'center',
    fontSize: 18,
    padding: 24
  },
  toolbarTitle: {
    fontFamily: 'Biotif-Regular',
    fontSize: 30,
    marginTop: 16,
    marginBottom: 8
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
})
