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
    width: 98,
    paddingTop: 9,
    paddingHorizontal: 4
  },
  walletInfo: {
    flex: 1,
    paddingLeft: 14
  },
  walletTop: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column'
  },
  walletUsername: {
    flex: 1,
    fontFamily: 'BentonSans-Bold',
    fontSize: 23,
    color: Colors.charcoal
  },
  walletBottom: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 15,
    justifyContent: 'flex-end'
  },
  walletButton: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  },
  walletButtonNumber: {
    fontFamily: 'BentonSans-Bold',
    fontSize: 24,
    color: Colors.unselect
  },
  walletButtonText: {
    textTransform: 'uppercase',
    fontSize: 12,
    color: Colors.unselect
  },
  walletSelected: {
    color: Colors.brandBlue
  }
})
