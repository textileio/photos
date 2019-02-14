import { StyleSheet } from 'react-native'

import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: color.screen_primary,
    flex: 1
  },
  contentContainer: {
    paddingTop: 20
  },
  toolbarLeft: {
    height: 16,
    width: 40
  },
  title: {
    fontFamily: 'Biotif-Regular',
    fontSize: 34,
    marginBottom: 17,
    paddingLeft: 14
  },
  photoList: {
    flexWrap: 'wrap'
  },
  photo: {
    marginLeft: 5,
    marginBottom: 5,
    resizeMode: 'contain',
    backgroundColor: 'red'
  }
})
