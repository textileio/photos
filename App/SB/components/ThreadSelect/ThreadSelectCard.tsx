import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, TouchableOpacity } from 'react-native'

import { ThreadData } from '../../../Redux/GroupsRedux'
import PhotoWithTextBox from '../PhotoWithTextBox'
import RadioButton from '../../components/RadioButton'

import styles from './statics/styles'

interface ScreenProps {
  thread: ThreadData
  selected: boolean
  disabled?: boolean
  onSelect?: (threadId: string) => void
}

type Props = ScreenProps

class ThreadSelectCard extends Component<Props> {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={!this.props.onSelect ? 1.0 : 0.6}
        style={styles.threadItem}
        /* tslint:disable-next-line */
        onPress={() => {
          if (this.props.onSelect) {
            this.props.onSelect(this.props.thread.id)
          }
        }}
      >
        <PhotoWithTextBox
          text={this.props.thread.name}
          hash={this.props.thread.thumb}
        />
        <View style={styles.threadSelectRadio}>
          <RadioButton
            selected={this.props.selected}
            disabled={this.props.disabled}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

export default ThreadSelectCard
