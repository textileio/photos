import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'
import { Colors } from '../../../../Themes'
import { PRODUCT_ITEM_HEIGHT, PRODUCT_ITEM_OFFSET } from '../../../../Components/Styles/PhotoGridStyles'

export default StyleSheet.create({
  titleCard: {
    fontFamily: 'BentonSans',
    fontSize: 30,
    marginTop: 11,
    marginBottom: 11,
    paddingHorizontal: 8
  },
  card: {
    paddingBottom: 25,
    marginBottom: 9
  },
  cardHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardHeaderRight: {
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  cardHeaderLeft: {
    width: '50%'
  },
  cardAction: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 8
  },
  cardActionName: {
    ...BentonSansBold()
  },
  detailUpdateTime: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    color: '#9b9b9b',
    paddingRight: 8
  },
  cardImage: {
    marginBottom: 8
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
})
