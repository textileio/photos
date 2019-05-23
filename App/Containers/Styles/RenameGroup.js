import { StyleSheet } from 'react-native'

import { color, spacing, size, fontSize } from '../../styles'

export const container = {
  flex: 1,
  backgroundColor: color.grey_3,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  padding: spacing._024
}

export const inputStyle = {
  height: size._064,
  fontSize: fontSize._20,
  color: color.grey_1
}

export const buttonContainer = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
}

export const buttons = {
  marginTop: spacing._048,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
}

export const cancelButtonText = {
  color: color.grey_2,
  fontSize: fontSize._20,
  fontFamily: 'Biotif-Regular',
  textAlign: 'center'
}

export const confirmButtonText = {
  color: color.action_2,
  fontSize: fontSize._20,
  fontFamily: 'Biotif-Regular',
  textAlign: 'center'
}
