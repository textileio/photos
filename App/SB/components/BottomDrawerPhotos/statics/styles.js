import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 3,
    // marginTop: 100, // <- changed because headers will be outside of Containers now...
    backgroundColor: '#FAFCFE',
    height: 400,
    position: 'absolute',
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
    fontFamily: "BentonSans",
    fontSize: 14,
    color: "#9b9b9b"
  },
  closeButtonWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 12
  },
  closeIcon: {
    paddingBottom: 16,
    width: 13,
    height: 13
  },
  listContainer: {
    paddingBottom: 22
  },
  photoElement: {
    marginTop: 10,
    marginBottom: 0
  }
})
