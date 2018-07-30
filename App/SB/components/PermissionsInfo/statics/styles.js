import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    margin: 20,
    paddingHorizontal: 10,
    paddingTop: 3,
    // marginTop: 100, // <- changed because headers will be outside of Containers now...
    backgroundColor: '#FAFCFE'
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
  },
  closeIcon: {
    paddingBottom: 16,
    width: 13,
    height: 13
  },
  detailsContainer: {
    paddingVertical: 22,
    paddingHorizontal: 14,
  },
  details: {
    fontFamily: "BentonSans",
    fontSize: 12,
    color: "#9b9b9b",
    lineHeight: 18
  },
  photoElement: {
    marginTop: 10,
    marginBottom: 0
  }
})
