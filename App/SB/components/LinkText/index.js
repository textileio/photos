import React from 'react'
import PropTypes from 'prop-types'
import {Text} from 'react-native'
import {noop} from 'lodash'

import styles from './styles'

const LinkText = ({children, style}) => (
  <Text style={[styles.linkColor, style]}>{children}</Text>
)

LinkText.propTypes = {
  children: PropTypes.string.isRequired,
  style: PropTypes.shape({})
}

LinkText.defaultProps = {
  style: {}
}

export default LinkText
