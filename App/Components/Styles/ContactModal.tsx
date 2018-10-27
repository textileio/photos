import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native'

import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    padding: 0,
    margin: 0,
    top: 0
  } as ViewStyle,
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: 'white'
  } as ViewStyle,
  content: {
    flex: 1
  } as ViewStyle,
  profile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 19,
    borderBottomColor: Colors.text,
    borderBottomWidth: 1,
    backgroundColor: 'white'
  } as ViewStyle,
  username: {
    marginLeft: 18,
    fontFamily: 'BentonSans-Bold',
    color: Colors.cover,
    fontSize: 32
  } as TextStyle,
  threadsList: {
    width: '100%',
    flex: 0,
    paddingHorizontal: 19,
    paddingTop: 24
  } as TextStyle,
  threadsTitle: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    color: '#9b9b9b',
    paddingBottom: 16
  } as TextStyle
})
