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
    // flex: 1,
    // borderTopColor: Colors.transparent,
    // borderTopWidth: 0,
    // borderBottomColor: Colors.test,
    // borderBottomWidth: 0,
    // // paddingLeft: 0,
    // // paddingRight: 0,
    // paddingLeft: 18,
    // paddingRight: 18,

    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 20,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: Colors.transparent,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardStyle: {
  },
  statusCell: {
  },
  photoCell: {
  },
  photoStatus: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  noPhotos: {
    alignSelf: 'center',
  },
  statusWhite: {
    width: 10,
    height: 10,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: Colors.silver,
    backgroundColor: Colors.transparent,
  },
  statusPink: {
    width: 10,
    height: 10,
    marginRight: 6,
    backgroundColor: Colors.brandPink,
  },
  statusRed: {
    width: 10,
    height: 10,
    marginRight: 6,
    backgroundColor: Colors.brandRed,
  },
  statusBlue: {
    width: 10,
    height: 10,
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
