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
    paddingHorizontal: 18,
    marginBottom: 40
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
  labelStyle: {
    color: '#9b9b9b',
    fontSize: 16
  },
  title: {
    fontFamily: 'BentonSans',
    fontSize: 34,
    lineHeight: 34,
    marginBottom: 6
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    overflow: 'hidden'
  },
  formImage: {
    height: 46,
    width: 48,
    marginRight: 15,
    marginBottom: 8
  }
})
