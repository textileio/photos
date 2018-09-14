import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 51,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: '#EDEDEE',
    paddingHorizontal: 20,
    position: 'relative',
    bottom: 0,
    width: '100%'
  },
  textInput: {
    flexGrow: 1
  },
  plus: {
    fontSize: 18
  }
})
