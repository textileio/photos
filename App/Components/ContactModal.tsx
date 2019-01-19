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
import { getThreadThumbs } from '../Redux/PhotoViewingSelectors'

// Styles
import styles from './Styles/ContactModal'
import { RootState } from '../Redux/Types'
import { ThreadThumbs } from '../Redux/PhotoViewingRedux'

interface ScreenProps {
  isVisible: boolean
  peerId: string
  username: string
  avatar?: string
  close: () => void
  navigateToThread: (id: string, name: string) => void
}

class ContactModal extends React.Component<DispatchStateProps & ScreenProps> {

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
            <Avatar style={{ width: 72, height: 72 }} target={this.props.avatar} />
            <Text style={styles.username}>{this.props.username}</Text>
          </View>
          <ScrollView style={styles.threadsList}>
            <Text style={styles.threadsTitle}>
              {this.props.threadThumbs.length > 0 ? 'Sharing in Groups:' : 'Not part of any shared groups'}
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
  threadThumbs: ReadonlyArray<ThreadThumbs>
}

const mapStateToProps = (state: RootState, ownProps: ScreenProps): DispatchStateProps => {
  return {
    threadThumbs: getThreadThumbs(state, ownProps.peerId, 'name')
  }
}

export default connect(mapStateToProps, undefined)(ContactModal)
