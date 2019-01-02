import { Dimensions, StyleSheet, Platform, ViewStyle } from 'react-native'
import { Colors } from '../../Themes'

const { width, height } = Dimensions.get('window')

// orientation must fixed
export const SCREEN_WIDTH = width < height ? width : height

export const isSmallDevice = SCREEN_WIDTH <= 414
export const numColumns = isSmallDevice ? 4 : 5

export const PRODUCT_ITEM_OFFSET = 0.5
export const PRODUCT_ITEM_MARGIN = PRODUCT_ITEM_OFFSET
const ITEM_WIDTH = (SCREEN_WIDTH - PRODUCT_ITEM_MARGIN) / numColumns -
  PRODUCT_ITEM_MARGIN
export const PRODUCT_ITEM_HEIGHT = ITEM_WIDTH

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFE'
  } as ViewStyle,
  listContainer: {
    flex: 1,
    margin: PRODUCT_ITEM_OFFSET
  },
  item: {
    margin: PRODUCT_ITEM_OFFSET,
    width: ITEM_WIDTH,
    height: PRODUCT_ITEM_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignContent: 'center'
  },
  itemBackgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  username: {
    fontFamily: 'BentonSans',
    alignSelf: 'center',
    color: Colors.charcoal,
    backgroundColor: Colors.clear,
    textAlign: 'center'
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center'
  },
  noPeers: {
    fontFamily: 'BentonSans',
    padding: 20,
    alignSelf: 'center',
    color: Colors.steel,
    backgroundColor: Colors.clear,
    textAlign: 'center'
  }
})
