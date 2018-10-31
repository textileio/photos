import { StyleSheet, ViewStyle, TextStyle } from 'react-native'

export default StyleSheet.create({
  threadDetail: {
    paddingHorizontal: 4,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  } as ViewStyle,
  imageList: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  } as ViewStyle,
  createThreadBox: {
    borderWidth: 2,
    borderColor: '#EEE',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginTop: 27,
    marginBottom: 29,
    marginHorizontal: 10,
    height: 200,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
  createThreadText: {
    color: '#BBB',
    fontFamily: 'BentonSans'
  } as TextStyle
})
