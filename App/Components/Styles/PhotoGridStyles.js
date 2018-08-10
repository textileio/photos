import {Dimensions, StyleSheet, Platform} from 'react-native'
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
    justifyContent: 'flex-end'
  },
  navigationIcon: {
    flex: 1,
    // position: 'relative',
    flexDirection: 'row',
    color: Colors.frost,
    backgroundColor: Colors.transparent
  },
  container: {
    flex: 1,
    backgroundColor: Colors.snow
  },
  listContainer: {
    flex: 1
  },
  item: {
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: Colors.snow
  },
  itemBackgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  itemOverlay: {
    // opacity: 0.5,
    // backgroundColor: '#000000',
    alignSelf: 'flex-end',
    margin: 5
  },
  itemImage: {
    flex: 1,
    flexDirection: 'column'
  },
  columnWrapper: {
    alignItems: 'flex-end'
  },
  tileStyle: {
    padding: 0,
    margin: 0,
    height: 15
  },
  statusCell: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: -18,
    height: 10
  },
  photoCell: {
  },
  photoStatus: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center'
  },
  noPhotos: {
    fontFamily: 'BentonSans',
    padding: 20,
    alignSelf: 'center',
    color: Colors.steel,
    backgroundColor: Colors.clear,
    textAlign: 'center'
  },
  statusWhite: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: Colors.silver,
    backgroundColor: Colors.transparent
  },
  message: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'flex-start'
  }
})
