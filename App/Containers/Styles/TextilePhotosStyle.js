import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1
  },
  backgroundOverlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch'
  },
  navHeader: {
    // remove the border in this case
    backgroundColor: 'white',
    borderBottomWidth: 0
  },
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
    flexDirection: 'row',
  },
  walletStatsTopColumn: {
    flex: 1,
    justifyContent: 'center',
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
  },
  gridContainer: {
    flex: 1
  },
  bottomOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  overlayText: {
    color: 'white',
    fontFamily: 'BentonSans'
  }
})
