import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 9,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: '#ECEDEE'
  },
  textContainer: {
    flex: 1,
    marginLeft: 11,
    marginRight: 11
  },
  text: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    marginBottom: 5
  },
  timestamp: {
    fontFamily: 'BentonSans',
    fontSize: 11,
    color: '#9B9B9B'
  },
  unread: {
    // color: '#7C848D'
    // fontFamily: 'BentonSans-Bold'
  },
  readImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.85,
    backgroundColor: '#ECEDEE',
    width: 40,
    height: 40
  },
  headerIconUser: {
    width: 29,
    height: 29,
    overflow: 'hidden',
    alignItems: 'center',
    borderRadius: 12
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  strong: {
    ...BentonSansBold()
  }
})
