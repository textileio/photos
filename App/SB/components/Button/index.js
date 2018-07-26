import React from 'react'
import PropTypes from 'prop-types'
import {Button as Btn} from 'react-native-elements'

import stylePropType from '../../util/stylePropType'

import styles from './styles'

const getStyle = (template, primary, danger, style) => {
  let computedStyle
  if (primary) {
    computedStyle = template.buttonPrimary
  } else if (danger) {
    computedStyle = template.buttonDanger
  } else {
    computedStyle = template.buttonDefault
  }

  return [template.button, computedStyle, style]
}

const getIcon = (primary, danger, icon) => {
  if (!icon || icon.color) {
    return icon
  }
  let computedStyle
  if (primary) {
    computedStyle = styles.buttonIcon.buttonPrimary
  } else if (danger) {
    computedStyle = styles.buttonIcon.buttonDanger
  } else {
    computedStyle = styles.buttonIcon.buttonDefault
  }
  return {...icon, style: computedStyle}
}

const Button = ({primary, danger, buttonStyle, style, icon, ...elementProps}) => (
  <Btn
    buttonStyle={getStyle(styles.button, primary, danger, buttonStyle)}
    textStyle={getStyle(styles.buttonText, primary, danger, style)}
    icon={getIcon(primary, danger, icon)}
    {...elementProps}
  />
)

Button.propTypes = {
  icon: PropTypes.shape({}),
  buttonStyle: stylePropType,
  style: stylePropType,
  primary: PropTypes.bool,
  danger: PropTypes.bool
}

Button.defaultProps = {
  icon: null,
  style: {},
  primary: false,
  danger: false
}

export default Button
