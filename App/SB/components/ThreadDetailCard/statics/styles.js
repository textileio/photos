import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  titleCard: {
    fontFamily: 'BentonSans',
    fontSize: 30,
    marginTop: 27,
    marginBottom: 11,
    paddingHorizontal: 11
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 25,
    marginBottom: 9
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginTop: 8,
    marginBottom: 8
  },
  cardAvatar: {},
  cardAction: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    lineHeight: 14,
    paddingLeft: 4,
    paddingTop: 4
  },
  cardActionName: {
    ...BentonSansBold()
  },
  cardImage: {
    marginBottom: 10,
    overflow: 'hidden'
  },
  cardFooter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 11
  },
  cardFooterTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  cardFooterTopItem: {
    marginLeft: 11
  },
  profileName: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    lineHeight: 16
  },
  commentCount: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    color: '#9b9b9b',
    lineHeight: 16,
    paddingTop: 6,
    paddingBottom: 8
  },
  likedText: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    lineHeight: 16,
    paddingTop: 6,
    paddingBottom: 2
  },
  cardFooterBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  detailUpdateTime: {
    fontFamily: 'BentonSans',
    fontSize: 10,
    color: '#9b9b9b',
    paddingRight: 8
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
  }
})
