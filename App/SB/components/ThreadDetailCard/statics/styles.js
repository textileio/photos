import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  toolbarUserIcon: {
    height: 27,
    width: 27,
    marginRight: 10
  },
  card: {
    flexDirection: 'row',
    paddingBottom: 25,
    marginBottom: 9,
    overflow: 'hidden'
  },
  cardLeft: {
    marginRight: 16,
    alignItems: 'center',
    width: 50
  },
  dateContainer: {
    backgroundColor: '#FAFCFE',
    paddingBottom: 15
  },
  userPhotosContainer: {
    flexDirection: 'row',
    marginBottom: 8
  },
  carLeftLine: {
    width: 1,
    height: '100%',
    position: 'absolute',
    zIndex: -10,
    flexDirection: 'column',
    top: 20,
    paddingBottom: 25
  },
  cardRight: {},
  month: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    color: '#9b9b9b',
    marginBottom: 9,
    textAlign: 'center'
  },
  day: {
    fontFamily: 'BentonSans',
    fontSize: 30,
    textAlign: 'center'
  },
  cardAction: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    marginBottom: 8
  },
  cardImage: {
    marginBottom: 8,
    width: 280
  },
  cardActionName: {
    ...BentonSansBold()
  }
})