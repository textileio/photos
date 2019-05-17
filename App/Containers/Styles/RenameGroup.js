import { StyleSheet } from 'react-native'

import Colors from '../../Themes/Colors'
import { color } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.modalColor,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20
  },
  inputStyle: {
    height: 60,
    fontSize: 20,
    color: color.grey_1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButtonText: {
    color: color.grey_2,
    fontSize: 20,
    fontFamily: 'Biotif-Regular',
    textAlign: 'center'
  },
  confirmButtonText: {
    color: color.action_2,
    fontSize: 20,
    fontFamily: 'Biotif-Regular',
    textAlign: 'center'
  }
})
