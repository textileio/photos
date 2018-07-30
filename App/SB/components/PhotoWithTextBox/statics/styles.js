import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9
  },
  item: {
    overflow: 'hidden',
    alignItems: 'center',
    marginRight: 14,
    height: 50,
    width: 71
  },
  itemBackgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  itemText: {
    fontFamily: "BentonSans",
    fontSize: 14,
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
  }
})
