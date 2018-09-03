import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  contentContainer: {
    paddingTop: 16,
    paddingHorizontal: 16
  },
  toolbarLeft: {
    height: 16,
    width: 40
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toolbarBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 11,
    marginBottom: 10
  },
  toolbarTitle: {},
  toolbarImage: {
    height: 59,
    width: 59
  },
  toolbarUserName: {
    fontFamily: 'BentonSans',
    fontSize: 24,
    marginBottom: 8
  },
  toolbarThreadsQty: {
    fontFamily: 'BentonSans',
    fontSize: 13
  },
  strong: {
    ...BentonSansBold()
  },
  title: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    color: '#9b9b9b',
    marginBottom: 17
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9
  },
  itemPhoto: {
    height: 50,
    width: 70,
    marginRight: 14
  },
  itemText: {
    fontFamily: 'BentonSans',
    fontSize: 14
  }
})
