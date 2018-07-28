import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  itemBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 71,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#D8D8D8'
  },
  itemBoxPlus: {
    width: 17.2,
    height: 17.1,
  },
  itemText: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#2625ff'
  }
})