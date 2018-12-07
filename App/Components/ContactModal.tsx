import React from 'react'
import { connect } from 'react-redux'
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
import { getThreadThumb } from '../Redux/PhotoViewingSelectors'
import { ContactsSelectors } from '../Redux/ContactsRedux'

// Styles
import styles from './Styles/ContactModal'
import { RootState } from '../Redux/Types'
import { ThreadThumb } from '../Redux/PhotoViewingRedux'
import { ThreadInfo } from '../NativeModules/Textile'

interface ScreenProps {
  isVisible: boolean
  peerId: string
  username: string
  close: () => void
  navigateToThread: (id: string, name: string) => void
}

class ContactModal extends React.Component<DispatchStateProps & ScreenProps> {

  defaultSource = require('../Images/v2/main-image.png')

  navigate (id: string, name: string) {
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
              {this.props.threadThumbs.length > 0 ? 'Sharing in Threads:' : 'Not part of any shared threads'}
            </Text>
            {this.props.threadThumbs.map((thread, i) => (
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
  threads: ReadonlyArray<ThreadInfo>
  threadThumbs: ThreadThumb[]
}

const mapStateToProps = (state: RootState, ownProps: ScreenProps): DispatchStateProps => {
  const threads = ContactsSelectors.getContactThreads(state, ownProps.peerId)

  const threadThumbs: ThreadThumb[] = threads.reduce((thumbs, thread) => {
    const thumb = getThreadThumb(state, thread.id)
    if (thumb) {
      thumbs.push(thumb)
    }
    return thumbs
  }, [] as ThreadThumb[])

  return {
    threads,
    threadThumbs
  }
}

export default connect(mapStateToProps, undefined)(ContactModal)
