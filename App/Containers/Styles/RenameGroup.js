import { StyleSheet } from 'react-native'

import { color as colors } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20
  },
  inputStyle: {
    height: 60,
    fontSize: 20,
    fontFamily: 'Biotif-Regular',
    color: colors.grey_1,
  },
  buttonText: {
    marginTop: 40,
    color: colors.action_2,
    fontSize: 20,
    fontFamily: 'Biotif-Regular',
    textAlign: 'center'
  }
})
