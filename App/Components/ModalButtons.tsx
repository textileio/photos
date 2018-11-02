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
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 84,
    height: '25%'
  } as ViewStyle,
  buttonText: {
    fontFamily: 'BentonSans',
    color: Colors.midBlue,
    fontSize: 18,
    lineHeight: 26
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
  return (
    <View style={styles.bottomRow}>
      <TouchableOpacity
        onPress={props.cancel}
      >
        <Text style={styles.buttonText}>{props.cancelText || 'Cancel'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!props.continueEnabled}
        onPress={props.continue}
      >
        <Text style={[styles.buttonText, !props.continueEnabled && styles.disabled]}>{props.continueText || 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalButtons
