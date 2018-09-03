import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 19,
    paddingTop: 24
  },
  toolbarLeft: {
    height: 16,
    width: 40,
    marginBottom: 16
  },
  toolbarTitle: {
    fontFamily: 'BentonSans',
    fontSize: 30
  },
  mainImage: {
    alignSelf: 'center',
    marginBottom: 44
  },
  imageText: {
    fontFamily: 'BentonSans',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 38
  },
  imageList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginBottom: 28
  }
})
