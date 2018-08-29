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
  commentRow: {
  },
  comment: {
    height: 40
  },
  imagePreviewRow: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200
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
