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
  profile: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 19,
    paddingBottom: 178,
    borderBottomColor: Colors.text,
    borderBottomWidth: 1,
    backgroundColor: 'white'
  } as ViewStyle,
  username: {
    textAlign: 'center',
    paddingVertical: 14,
    fontFamily: 'Biotif-Bold',
    fontSize: 32
  } as TextStyle,
  threadsList: {
    width: '100%',
    flex: 0,
    paddingHorizontal: 19,
    paddingTop: 24,
    borderBottomColor: Colors.text,
    borderBottomWidth: 1,
    backgroundColor: 'white'
  } as TextStyle,
  threadsTitle: {
    fontFamily: 'Biotif-Regular',
    fontSize: 14,
    color: '#9b9b9b',
    paddingBottom: 16
  } as TextStyle
})
