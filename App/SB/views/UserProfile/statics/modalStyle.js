import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 3,
    // marginTop: 100, // <- changed because headers will be outside of Containers now...
    backgroundColor: '#FAFCFE',
    position: 'absolute',
    height: 300,
    bottom: 0,
    left: 0,
    right: 0
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
  closeIconPadding: {
    paddingHorizontal: 15
  },
  closeIcon: {
    paddingBottom: 16,
    width: 13,
    height: 13
  },
  listContainer: {
    paddingBottom: 22
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    paddingVertical: 24
  },
  photoElement: {
    marginTop: 10,
    marginBottom: 0
  }
})
