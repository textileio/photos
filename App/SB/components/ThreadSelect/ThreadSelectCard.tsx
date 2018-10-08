import React, {Component} from 'react'
import { connect } from 'react-redux'
import { View, TouchableOpacity } from 'react-native'

import { RootState } from '../../../Redux/Types'

import {ThreadData} from '../../../Redux/PhotoViewingRedux'
import {Photo, ThreadId} from '../../../Models/TextileTypes'
import PhotoWithTextBox from '../PhotoWithTextBox'
import RadioButton from '../../components/RadioButton'

import styles from './statics/styles'

interface StateProps {
  thumb?: Photo
}

interface ScreenProps {
  thread: ThreadData
  selected: boolean
  onSelect: (threadId: ThreadId) => void
}

type Props = StateProps & ScreenProps

class ThreadSelectCard extends Component<Props> {
  render () {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.threadItem}
        /* tslint:disable-next-line */
        onPress={() => {
          this.props.onSelect(this.props.thread.id)
        }}
      >
        <PhotoWithTextBox text={this.props.thread.name} photo={this.props.thumb} />
        <View style={styles.threadSelectRadio}>
          <RadioButton selected={this.props.selected} />
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: ScreenProps): StateProps  => {
  const t = ownProps.thread.id
  const thread = state.photoViewing.threads[t]
  const thumb =  thread && thread.photos && thread.photos.length > 0 ? thread.photos[0] : undefined
  return {
    thumb
  }
}

export default connect(mapStateToProps, undefined)(ThreadSelectCard)
