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
    position: 'relative',
    bottom: 60,
    width: '100%',
    zIndex: 100
  }
})