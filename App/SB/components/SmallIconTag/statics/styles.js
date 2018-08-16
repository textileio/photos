import { StyleSheet } from 'react-native'
import { PRODUCT_ITEM_OFFSET } from '../../../../Components/Styles/PhotoGridStyles'

export default StyleSheet.create({
  detail: {
    flexDirection: 'row',
    marginRight: 9,
    marginTop: 4,
    width: '100%'
  },

  detailImageView: {
    height: 27,
    width: 27,
    overflow: 'hidden',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10
  },
  detailImageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  detailImage: {
    height: 27,
    width: 27,
  },
  detailTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 33
  },
  detailText: {
    fontFamily: 'BentonSans-Light',
    fontSize: 14,
    lineHeight: 16
  }
})
