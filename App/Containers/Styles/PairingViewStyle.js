import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  key: {
    marginBottom: 14, alignSelf: 'center', fontSize: 8, fontFamily: 'Biotif-Regular'
  },
  status: {
    padding: 30, marginBottom: 20, alignSelf: 'center', fontFamily: 'Biotif-Regular', fontSize: 28, textAlign: 'justify'
  },
  message: {
    padding: 30, marginBottom: 20, alignSelf: 'center', fontFamily: 'Biotif-Regular', fontSize: 12, textAlign: 'justify'
  },
  button: {
    fontFamily: 'Biotif-Regular',
    color: Colors.charcoal,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'justify'
  },
  buttonMargin: {
    backgroundColor: 'transparent', height: 22
  }
})
