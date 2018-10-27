import React from 'react'
import { connect } from 'react-redux'
import {Dispatch} from 'redux'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-navigation'

import Avatar from './Avatar'
import { TextileHeaderButtons, Item } from './HeaderButtons'
import PhotoWithTextBox from '../SB/components/PhotoWithTextBox'
import { getThreads } from '../Redux/PhotoViewingSelectors'

// Styles
import styles from './Styles/ContactModal'
import { PeerId, ThreadId, Photo, ThreadName } from '../Models/TextileTypes'
import { RootState } from '../Redux/Types'

interface ScreenProps {
  isVisible: boolean
  peerId: PeerId
  username: string
  close: () => void
  navigateToThread: (id: ThreadId, name: ThreadName) => void
}

class ContactModal extends React.Component<DispatchStateProps & ScreenProps> {

  defaultSource = require('../Images/v2/main-image.png')

  navigate (id: ThreadId, name: ThreadName) {
    return () => {
      this.props.navigateToThread(id, name)
    }
  }
  render () {
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={styles.modal}
      >
      <SafeAreaView style={styles.container}>
        <TextileHeaderButtons left={true}>
          {/* tslint:disable-next-line jsx-no-lambda */}
          <Item title='Back' iconName='arrow-left' onPress={this.props.close} />
        </TextileHeaderButtons>
        <View style={styles.content}>
          <View style={styles.profile}>
            <Avatar width={72} height={72} peerId={this.props.peerId} defaultSource={this.defaultSource} />
            <Text style={styles.username}>{this.props.username}</Text>
          </View>
          <ScrollView style={styles.threadsList}>
            <Text style={styles.threadsTitle}>
              {this.props.threads.length > 0 ? 'Sharing in Threads:' : 'Not part of any shared threads'}
            </Text>
            {this.props.threads.map((thread, i) => (
              <TouchableOpacity key={i} onPress={this.navigate(thread.id, thread.name)}>
                <PhotoWithTextBox key={i} text={thread.name} photo={thread.thumb} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
      </Modal>
    )
  }
}

interface DispatchStateProps {
  threads: Array<{id: ThreadId, name: ThreadName, thumb?: Photo}>
}

const mapStateToProps = (state: RootState, ownProps: ScreenProps): DispatchStateProps => {
  const allThreads = getThreads(state)
  let threads
  if (allThreads.length > 0) {
    threads = allThreads
      .filter((thread) => thread.photos.some((p) => p.author_id === ownProps.peerId))
      .map((thread) => {
        return {
          id: thread.id,
          thumb: thread.photos.length > 0 ? thread.photos[0] : undefined,
          name: thread.name
        }
      })
  }

  return {
    threads: threads || []
  }
}

export default connect(mapStateToProps, undefined)(ContactModal)
