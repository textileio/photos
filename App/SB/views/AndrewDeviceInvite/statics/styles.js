import { StyleSheet } from 'react-native'
import { Colors } from '../../../../Themes'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 19,
    paddingTop: 24,
    paddingBottom: 200
  },
  toolbarLeft: {
    height: 16,
    width: 40,
    marginBottom: 16
  },
  toolbarTitle: {
    fontFamily: "BentonSans",
    fontSize: 30,
  },
  mainImage: {
    alignSelf: 'center',
    marginBottom: 44,
  },
  deviceId: {
    fontFamily: "BentonSans",
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 38
  },
  imageText: {
    fontFamily: "BentonSans",
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 38
  },
  imageList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginBottom: 28
  },
  button: {
    fontFamily: 'BentonSans',
    color: Colors.charcoal,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'justify'
  },
})
