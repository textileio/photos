import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  errorMsg: {
    fontFamily: 'Biotif-Regular',
    fontSize: 12,
    color: '#D0021B',
    paddingTop: 6
  },
  labelText: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  underlineWrapper: {
    height: 1,
    alignItems: 'center'
  },
  wrapper: {
    height: 72,
    paddingTop: 30,
    paddingBottom: 7,
    position: 'relative',
    width: '100%'
  },
  denseWrapper: {
    height: 60,
    paddingTop: 28,
    paddingBottom: 4,
    position: 'relative'
  },
  textInput: {
    fontFamily: 'Biotif-Regular',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
    color: '#6d6d6d'
  }
})
