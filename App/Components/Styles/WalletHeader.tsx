import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes/'

export default StyleSheet.create({
  walletHeader: {
    position: 'relative',
    height: 150,
    width: '100%',
    flexDirection: 'row',
    padding: 8,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEDEE',
    backgroundColor: 'white'
  },
  walletAvatar: {
    width: 104,
    paddingTop: 9,
    paddingHorizontal: 4
  },
  walletInfo: {
    flex: 1
  },
  walletTop: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'center'
  },
  walletUsername: {
    flex: 1,
    fontFamily: 'BentonSans-Bold',
    fontSize: 23,
    color: Colors.charcoal
  },
  walletBottom: {
    flex: 0.7,
    paddingHorizontal: 10,
    paddingBottom: 15
  },
  walletSettingsButton: {
    flex: 1,
    borderColor: 'rgba(20,20,33,0.1)',
    borderWidth: 2,
    borderRadius: 2,
    alignContent: 'center',
    justifyContent: 'center'
  },
  walletSettingsText: {
    color: 'rgba(20,20,33,0.75)',
    textAlign: 'center'
  }
})
