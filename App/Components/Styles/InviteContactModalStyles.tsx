import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native'

export default StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    padding: 0,
    margin: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around'
  } as ViewStyle,
  content: {
    flex: 1,
    overflow: 'hidden',
    alignContent: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 40
  } as ViewStyle,
  title: {
    flex: 0.15,
    alignItems: 'flex-start',
    paddingTop: 25,
    marginBottom: 20
  },
  titleText: {
    fontFamily: 'Biotif-Regular',
    fontSize: 24,
    marginBottom: 18
  },
  subTitleText: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    color: '#9b9b9b'
  },
  body: {
    overflow: 'hidden',
    flex: 0.6
  } as ViewStyle,
  buttons: {
    flex: 0.25
  } as ViewStyle
})
