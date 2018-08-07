import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2625FF'
  },
  msg: {
    paddingVertical: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white',
    maxWidth: '70%'
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 100
  },
  top: {
    position: 'absolute',
    top: 34,
    width: '100%',
    zIndex: 100
  }
})
