import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1,
  },
  contentContainer: {},
  toolbarIconUser: {
    width: 24,
    height: 24,
  },
  toolbar: {
    paddingHorizontal: 10
  },
  toolbarIconList: {
    width: 23,
    height: 20
  },
  toolbarTitle: {
    fontFamily: "BentonSans",
    fontSize: 30,
    paddingTop: 23,
  },
  fixedDate: {
    fontFamily: "BentonSans",
    fontSize: 12,
    color: "#4a4a4a",
    paddingLeft: 10,
    paddingBottom: 9,
    paddingTop: 20
  },
  bold: {
    ...BentonSansBold()
  }
})