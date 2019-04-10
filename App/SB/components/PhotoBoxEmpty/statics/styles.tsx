import { StyleSheet, ImageStyle, ViewStyle, TextStyle } from 'react-native'
import { Colors } from '../../../../Themes'

interface Styles {
  itemContainer: ViewStyle
  itemBox: ViewStyle
  itemText: TextStyle
  itemBoxPlus: ImageStyle
}

export default StyleSheet.create<Styles>({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
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
    height: 17.1
  } as ImageStyle,
  itemText: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    textDecorationLine: 'underline',
    color: Colors.midBlue
  }
})
