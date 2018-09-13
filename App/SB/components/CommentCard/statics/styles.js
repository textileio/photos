import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  withDivider: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#e1e1e1'
  },
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  content: {
    flexDirection: 'row',
    margin: 12
  },
  commentProfileImage: {
    width: 38,
    height: 37,
    marginRight: 11,
    overflow: 'hidden',
    alignItems: 'center',
    borderRadius: 9
  },
  profileContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  commentImage: {
    width: 38,
    height: 37
  },
  commentTexts: {
    flexGrow: 1
  },
  commentDate: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    color: '#9b9b9b',
    paddingRight: 12
  },
  commentUser: {
    fontFamily: 'BentonSans',
    fontSize: 14,
    marginBottom: 5
  },
  commentTextWrapper: {
    marginBottom: 5,
    flexDirection: 'row'
  },
  commentText: {
    fontFamily: 'BentonSans',
    fontSize: 12,
    lineHeight: 16,
    color: '#4a4a4a',
    flexWrap: 'wrap',
    flex: 1
  },
  commentIconLabel: {
    color: '#4a4a4a',
    marginLeft: 6
  }
})
