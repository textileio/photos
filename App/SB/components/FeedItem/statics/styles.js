import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 9,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE'
  },
  textContainer: {
    flexGrow: 1,
    marginLeft: 11
  },
  text: {
    fontFamily: "BentonSans",
    fontSize: 12,
    marginBottom: 5
  },
  timestamp: {
    fontFamily: "BentonSans",
    fontSize: 11,
    color: '#9B9B9B'
  },
  strong: {
    ...BentonSansBold()
  }
})