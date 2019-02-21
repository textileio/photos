import { StyleSheet } from 'react-native'

import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: color.screen_primary,
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 19,
    paddingTop: 24
  },
  toolbarLeft: {
    height: 16,
    width: 40,
    marginBottom: 16
  },
  toolbarTitle: {
    fontFamily: 'Biotif-Regular',
    fontSize: 30
  },
  mainImage: {
    alignSelf: 'center',
    marginBottom: 44
  },
  imageText: {
    fontFamily: 'Biotif-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 38
  },
  imageList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginBottom: 28
  }
})
