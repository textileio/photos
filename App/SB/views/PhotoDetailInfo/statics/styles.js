import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1,
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
    fontFamily: "BentonSans",
    fontSize: 30,
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
    fontFamily: "BentonSans",
    fontSize: 14,
    color: '#9B9B9B'
  },
  itemDescription: {
    fontFamily: "BentonSans",
    fontSize: 16,
  },
})