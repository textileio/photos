import { StyleSheet } from 'react-native'
import { Colors } from '../../../../Themes'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1
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
    fontFamily: 'Biotif-Regular',
    fontSize: 30
  },
  mainImage: {
    alignSelf: 'center',
    marginBottom: 44
  },
  deviceId: {
    fontFamily: 'Biotif-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 38
  },
  imageText: {
    fontFamily: 'Biotif-Regular',
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
    fontFamily: 'Biotif-Regular',
    color: Colors.charcoal,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'justify'
  }
})
