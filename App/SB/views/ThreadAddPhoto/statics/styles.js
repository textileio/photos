import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFCFE',
    flex: 1
  },
  contentContainer: {
    paddingTop: 20
  },
  toolbarLeft: {
    height: 16,
    width: 40
  },
  title: {
    fontFamily: 'BentonSans',
    fontSize: 34,
    marginBottom: 17,
    paddingLeft: 14
  },
  photoList: {
    flexWrap: 'wrap'
  },
  photo: {
    marginLeft: 5,
    marginBottom: 5,
    resizeMode: 'contain',
    backgroundColor: 'red'
  }
})
