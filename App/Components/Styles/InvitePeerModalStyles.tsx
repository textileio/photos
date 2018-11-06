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
    backgroundColor: 'white'
  } as ViewStyle,
  content: {
    flex: 1,
    alignContent: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 40
  } as ViewStyle,
  title: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 25,
    marginBottom: 30,
    height: '15%'
  },
  titleText: {
    fontFamily: 'BentonSans',
    fontSize: 24,
    marginBottom: 18
  },
  subTitleText: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    color: '#9b9b9b'
  },
  body: {
    flex: 1,
    backgroundColor: 'blue'
  } as ViewStyle
})
