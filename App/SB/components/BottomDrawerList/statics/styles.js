import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderColor: '#E1E1E1',
    borderBottomWidth: 1
  },
  title: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    color: '#9b9b9b'
  },
  closeIcon: {
    paddingBottom: 16,
    width: 13,
    height: 13
  },
  listContainer: {
    paddingBottom: 22
  },
  itemContainer: {
    borderColor: '#E1E1E1',
    borderBottomWidth: 1
  },
  itemText: {
    fontFamily: 'BentonSans',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 16
  }
})
