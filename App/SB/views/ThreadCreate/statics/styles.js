import { StyleSheet } from 'react-native'
import { BentonSansBold } from '../../../util/fonts'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  contentContainer: {
    paddingTop: 19,
    paddingHorizontal: 16
  },
  topRow: {
    flexDirection: 'row'
  },
  commentRow: {
    flex: 1
  },
  comment: {
    minHeight: 40,
    flexWrap: 'wrap'
  },
  imagePreviewRow: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
    height: 70,
    width: 70
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 70
  },
  toolbarLeft: {
    height: 16,
    width: 40
  },
  toolBarRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  link: {
    ...BentonSansBold(),
    fontSize: 16,
    color: '#2625ff'
  },
  title: {
    fontFamily: 'BentonSans',
    fontSize: 34,
    lineHeight: 34,
    marginBottom: 10
  }
})
