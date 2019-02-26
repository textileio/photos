import React from 'react'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { ContactInfo } from '@textile/react-native-sdk'

import Avatar from '../Components/Avatar'
import PhotoWithTextBox from '../SB/components/PhotoWithTextBox'
import { getThreadThumbs } from '../Redux/PhotoViewingSelectors'

// Styles
import styles from '../Components/Styles/ContactModal'
import { RootState } from '../Redux/Types'
import { ThreadThumbs } from '../Redux/PhotoViewingRedux'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'

interface NavProps {
  avatar: string
  username: string
  peerId: string
}

interface StateProps {
  threadThumbs: ReadonlyArray<ThreadThumbs>
}

type Props = StateProps & NavigationScreenProps<NavProps>

class ContactModal extends React.Component<Props> {

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavProps>) => {
    const back = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title='Back' iconName='arrow-left' onPress={back} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Contact Details'
    }
  }

  navigate (id: string) {
    return () => {
      this.props.navigation.navigate('ViewThread', { threadId: id })
    }
  }

  render () {
    const avatar = this.props.navigation.getParam('avatar')
    const username = this.props.navigation.getParam('username')
    return (
      <View style={styles.container}>
        <View style={styles.profile}>
          <Avatar style={{ width: 72, height: 72 }} target={avatar} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <ScrollView style={styles.threadsList}>
          <Text style={styles.threadsTitle}>
            {this.props.threadThumbs.length > 0 ? 'Sharing in Groups:' : 'Not part of any shared groups'}
          </Text>
          {this.props.threadThumbs.map((thread, i) => (
            <TouchableOpacity key={i} onPress={this.navigate(thread.id)}>
              <PhotoWithTextBox key={i} text={thread.name} photo={thread.thumb} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: NavigationScreenProps<NavProps>): StateProps => {
  const peerId = ownProps.navigation.getParam('peerId')
  return {
    threadThumbs: getThreadThumbs(state, peerId, 'name')
  }
}

export default connect(mapStateToProps, undefined)(ContactModal)
