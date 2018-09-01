import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  bottomBar: {
    width: '100%',
    borderTopColor: '#ECEDEE',
    borderTopWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomBarIcon: {
    height: 24,
    width: 24,
    marginHorizontal: 50,
    marginVertical: 14
  },
  bottomBarIconActive: {
    borderBottomColor: '#2625FF',
    borderBottomWidth: 2
  }
})
