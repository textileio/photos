import { StyleSheet } from 'react-native'

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
  walletStats: {
    flex: 1
  },
  walletStatsTop: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    flexDirection: 'row'
  },
  walletStatsTopColumn: {
    flex: 1,
    justifyContent: 'center'
  },
  walletStatsCount: {
    fontFamily: 'BentonSans-Bold',
    color: 'rgba(20,20,33,0.9)',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 2
  },
  statDim: {
    color: 'rgba(20,20,33,0.2)'
  },
  walletStatsTitle: {
    fontFamily: 'BentonSans',
    color: 'rgba(20,20,33,0.5)',
    textAlign: 'center',
    fontSize: 14
  },
  walletStatsBottom: {
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
