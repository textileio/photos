import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  navigationBar: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: Colors.transparent,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  navigationIcon: {
    flex: 1,
    // position: 'relative',
    flexDirection: 'row',
    color: Colors.frost,
    backgroundColor: Colors.transparent,
  },
  container: {
    flex: 1,
    paddingTop: 22,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: Colors.transparent,
  },
  tileStyle: {
    padding: 0,
    margin: 0,
    height: 15,
  },
  statusCell: {
    flex: 1,
    position: 'absolute',
    left: 0, right: 0, bottom: 0, top: -18,
    height: 10,
  },
  photoCell: {
  },
  photoStatus: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  noStatus: {
    flex: 1,
    height: 10,
  },
  noPhotos: {
    alignSelf: 'center',
  },
  statusWhite: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: Colors.silver,
    backgroundColor: Colors.transparent,
  },
  statusPink: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
    backgroundColor: Colors.brandPink,
  },
  statusRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
    backgroundColor: Colors.brandRed,
  },
  statusBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
    backgroundColor: Colors.brandBlue,
  },
  message: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  }
})
