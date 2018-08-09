import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'
import { Colors } from '../../../../Themes'
import { PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_OFFSET } from '../../../../Components/Styles/PhotoGridStyles'

export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingBottom: 25,
    marginBottom: 9,
    overflow: 'hidden'
  },
  cardLeft: {
    marginRight: 16,
    alignItems: 'center',
    width: 40
  },
  dateContainer: {
    backgroundColor: '#FAFCFE',
    paddingBottom: 15
  },
  userPhotosContainer: {
    flexDirection: 'row',
    marginBottom: 8
  },
  cardLeftLine: {
    width: 1,
    height: '100%',
    position: 'absolute',
    zIndex: -10,
    flexDirection: 'column',
    top: 20,
    paddingBottom: 25
  },
  cardRight: {},
  toolbarUserIcon: {
    height: 27,
    width: 27,
    marginRight: 10
  },
  month: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    color: '#9b9b9b',
    marginBottom: 9,
    textAlign: 'center'
  },
  day: {
    fontFamily: 'BentonSans',
    fontSize: 20,
    textAlign: 'center'
  },
  now: {
    fontSize: 16
  },
  cardAction: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    marginBottom: 8
  },
  cardImage: {
    marginBottom: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStretch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  image: {
    alignItems: 'center'
  },
  cardActionName: {
    ...BentonSansBold()
  }
})
