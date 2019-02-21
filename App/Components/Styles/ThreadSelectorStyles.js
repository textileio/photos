import { StyleSheet } from 'react-native'

import { color } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.screen_primary
  },
  toolbarLogo: {
    width: 82.5,
    height: 23
  },
  toolbarIcon: {
    width: 24,
    height: 24
  },
  contentContainer: {
    marginTop: 0,
    marginHorizontal: 1,
    position: 'absolute',
    // ensure the flatlist spreads the whole container
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  createThreadBox: {
    marginTop: 12,
    marginBottom: 29,
    marginHorizontal: 10,
    height: 80,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  createThreadText: {
    color: '#BBB',
    fontFamily: 'Biotif-Regular'
  }
})
