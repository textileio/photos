import React from 'react'
import Colors from '../Themes/Colors'
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleSheet
} from 'react-native'

const styles = StyleSheet.create({
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'flex-end',
    alignContent: 'center',
    marginBottom: 84,
    height: '25%'
  } as ViewStyle,
  button: {
    width: '40%',
    alignItems: 'center'
  } as ViewStyle,
  buttonText: {
    fontFamily: 'BentonSans',
    color: Colors.midBlue,
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center'
  } as TextStyle,
  disabled: {
    color: Colors.windowTint
  } as TextStyle
})

interface ScreenProps {
  continueEnabled?: boolean
  cancel: () => void
  continue: () => void
  cancelText?: string
  continueText?: string
}

const ModalButtons = (props: ScreenProps) => {
  const cancelText = props.cancelText ? props.cancelText : 'Cancel'
  const continueText = props.continueText ? props.continueText : 'Continue'
  return (
    <View style={styles.bottomRow}>
      <TouchableOpacity
        onPress={props.cancel}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{cancelText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!props.continueEnabled}
        onPress={props.continue}
        style={styles.button}
      >
        <Text style={[styles.buttonText, !props.continueEnabled && styles.disabled]}>{continueText}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalButtons
