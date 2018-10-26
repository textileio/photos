import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native'

import Colors from '../../Themes/Colors'

const {height, width} = Dimensions.get('window')

export default StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    padding: 0,
    margin: 0
  } as ViewStyle,
  fullModal: {
    top: 0
  } as ViewStyle,
  slideModal: {
    width,
    height: 280
  } as ViewStyle,
  container: {
    flex: 1,
    backgroundColor: Colors.modalColor
  } as ViewStyle,
  content: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 45
  } as ViewStyle,
  titleText: {
    fontFamily: 'BentonSans',
    color: Colors.charcoal,
    fontSize: 28,
    textAlign: 'center'
  } as TextStyle,
  header: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 40,
    justifyContent: 'center'
  } as ViewStyle,
  headerText: {
    fontFamily: 'BentonSans',
    color: Colors.cover,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'left'
  } as TextStyle,
  topRow: {
    flexDirection: 'row',
    paddingHorizontal: 40
  } as ViewStyle,
  inputStyle: {
    height: 40,
    borderWidth: 0
  } as ViewStyle,
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 45,
  } as ViewStyle,
  buttonText: {
    fontFamily: 'BentonSans',
    color: Colors.midBlue,
    fontSize: 18,
    lineHeight: 26
  } as TextStyle,
  bottomRowMargin: {
    marginBottom: 20
  } as TextStyle,
  disabled: {
    color: Colors.windowTint
  } as TextStyle
})
