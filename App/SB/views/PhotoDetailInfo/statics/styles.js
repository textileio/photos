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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE'
  },
  itemTitle: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    color: '#9B9B9B'
  },
  itemDescription: {
    fontFamily: 'Biotif-Regular',
    fontSize: 16
  }
})
