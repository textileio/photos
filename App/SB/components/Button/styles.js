import {StyleSheet} from 'react-native'

export default {
  button: StyleSheet.create({
    button: {
      borderRadius: 6,
      width: 300,
      height: 50
    },
    buttonDefault: {
      backgroundColor: '#DCDCDC',
      borderWidth: 1,
      borderColor: '#7D7D7D'
    },
    buttonPrimary: {
      backgroundColor: '#2625ff'
    },
    buttonDanger: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'red'
    }
  }),
  buttonText: StyleSheet.create({
    button: {
      fontFamily: 'BentonSans',
      fontSize: 18,
      textAlign: 'center'
    },
    buttonDefault: {
      color: '#333333'
    },
    buttonPrimary: {},
    buttonDanger: {
      color: 'red'
    }
  }),
  buttonIcon: StyleSheet.create({
    button: {},
    buttonDefault: {
      color: '#333333'
    },
    buttonPrimary: {},
    buttonDanger: {
      color: 'red'
    }
  })
}
