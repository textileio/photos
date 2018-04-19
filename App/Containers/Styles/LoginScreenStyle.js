import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import { Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  image: {
    alignSelf: 'center',
    margin: 44
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Biotif-Regular',
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: Colors.brandBlue,
    borderColor: '#48BBEC',
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
})
