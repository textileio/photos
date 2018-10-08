import React, {Component} from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { View, TouchableOpacity } from 'react-native'

import RadioButton from '../../components/RadioButton'
import styles from './statics/styles'

import { RootState, RootAction } from '../Redux/Types'
import {ThreadData} from '../../../Redux/PhotoViewingRedux'
import {Photo, ThreadId} from '../../../Models/TextileTypes'

import PhotoWithTextBox from '../PhotoWithTextBox'

interface StateProps {
  thumb: Photo
}

interface ScreenProps {
  thread: ThreadData
  selected: boolean
  onSelect: (threadId: ThreadId) => void
}

interface DispatchProps {
  // updateComment: (comment: string) => void
  // submitComment: () => void
}

type Props = StateProps & DispatchProps & ScreenProps

class ThreadSelectCard extends Component<Props> {
  render () {
    return (
      <TouchableOpacity activeOpacity={0.6} style={styles.contactItem} onPress={() => {
        // select(this.props.thread, this.props.thread.included)
        this.props.onSelect(this.props.thread.id)
      }}>
        <PhotoWithTextBox text={this.props.thread.name} photo={this.props.thumb} />
        <View style={styles.contactSelectRadio}>
          <RadioButton selected={this.props.selected} />
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: ScreenProps): StateProps  => {
  const t = ownProps.thread.id
  const thumb = state.photoViewing.threads[t].photos.length > 0 ? state.photoViewing.threads[t].photos[0] : undefined

  return {
    thumb
  }
}

export default connect(mapStateToProps, undefined)(ThreadSelectCard)
