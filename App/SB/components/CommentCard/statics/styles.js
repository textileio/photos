import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  withDivider: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#e1e1e1",
  },
  comment: {
    flexDirection: 'row',
    marginRight: 12,
    paddingBottom: 23,
    paddingTop: 15,
    width: '100%',
  },
  subComment: {
    maxWidth: '70%'
  },
  commentImage: {
    width: 38,
    height: 37,
    marginRight: 11
  },
  commentTexts: {
    flexGrow: 1
  },
  commentDate: {
    fontFamily: "BentonSans",
    fontSize: 12,
    color: "#9b9b9b",
    textAlign: 'right',
    maxWidth: 50,
    paddingRight: 12
  },
  commentUser: {
    fontFamily: "BentonSans",
    fontSize: 14,
    marginBottom: 5
  },
  commentText: {
    fontFamily: "BentonSans",
    fontSize: 12,
    lineHeight: 16,
    color: "#4a4a4a",
    marginBottom: 14
  },
  commentIconLabel: {
    color: "#4a4a4a",
    marginLeft: 6
  }
})