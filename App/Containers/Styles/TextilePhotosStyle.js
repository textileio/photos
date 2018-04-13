import {Dimensions, StyleSheet, Platform} from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

const { width, height } = Dimensions.get('window');
// orientation must fixed
export const SCREEN_WIDTH = width < height ? width : height

export const isSmallDevice = SCREEN_WIDTH <= 414
export const numColumns = isSmallDevice ? 3 : 4

export const PRODUCT_ITEM_OFFSET = 0.5
export const PRODUCT_ITEM_MARGIN = PRODUCT_ITEM_OFFSET * 2
const ITEM_WIDTH = (SCREEN_WIDTH - PRODUCT_ITEM_MARGIN) / numColumns -
  PRODUCT_ITEM_MARGIN
export const PRODUCT_ITEM_HEIGHT = ITEM_WIDTH

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
    backgroundColor: Colors.snow,
  },
  listContainer: {
    flex: 1,
    padding: PRODUCT_ITEM_OFFSET
  },
  item: {
    margin: PRODUCT_ITEM_OFFSET,
    overflow: 'hidden',
    width: ITEM_WIDTH,
    height: PRODUCT_ITEM_HEIGHT,
    // flexDirection: 'column',
    // flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.snow,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: 'rgba(0,0,0, .2)',
    //     shadowOffset: { height: 0, width: 0 },
    //     shadowOpacity: 1,
    //     shadowRadius: 1,
    //   },
    //   android: {
    //     elevation: 1,
    //   },
    // }),
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
    width: ITEM_WIDTH,
    height: PRODUCT_ITEM_HEIGHT,
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    flexDirection: 'column'
  },
  itemTitle: {
    flex: 1,
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
    }),
    margin: PRODUCT_ITEM_OFFSET * 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: PRODUCT_ITEM_OFFSET * 2,
    borderWidth: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.15)',
    margin: PRODUCT_ITEM_OFFSET * 2,
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  itemPriceClearance: {
    fontWeight: 'bold',
    color: 'red',
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
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center'
  },
  noPhotos: {
    fontFamily: 'Biotif-Regular',
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
