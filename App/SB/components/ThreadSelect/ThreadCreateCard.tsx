import React, {Component} from 'react'
import { View, TouchableOpacity } from 'react-native'

import PhotoBoxEmpty from '../PhotoBoxEmpty'
import RadioButton from '../../components/RadioButton'

import styles from './statics/styles'

interface ScreenProps {
  onSelect: () => void
}

class   ThreadSelectCard extends Component<ScreenProps> {
  render () {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.threadItem}
        /* tslint:disable-next-line */
        onPress={this.props.onSelect}
      >
        <PhotoBoxEmpty title={'Create new thread'} />
        <View style={styles.threadSelectRadio}>
          <RadioButton selected={false} />
        </View>
      </TouchableOpacity>
    )
  }
}

export default ThreadSelectCard
