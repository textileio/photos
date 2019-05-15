import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import Avatar from '../Components/Avatar'
import Button from '../Components/LargeButton'
import PhotoWithTextBox from '../SB/components/PhotoWithTextBox'
import { getThreadThumbs } from '../Redux/PhotoViewingSelectors'

// Styles
import styles from '../Components/Styles/ContactModal'
import { RootState, RootAction } from '../Redux/Types'
import { ThreadThumbs } from '../Redux/PhotoViewingRedux'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import { contactsActions } from '../features/contacts'
import { color } from '../styles'

interface NavProps {
  avatar: string
  username: string
  address: string
}

interface StateProps {
  displayName: string
  threadThumbs: ReadonlyArray<ThreadThumbs>
  address: string
  removing: boolean
}

interface DispatchProps {
  removeContact: (address: string) => void
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

  navigateToThread(id: string) {
    return () => {
      this.props.navigation.navigate('ViewThread', { threadId: id })
    }
  }

  render() {
    const avatar = this.props.navigation.getParam('avatar')
    // const username = this.props.navigation.getParam('username')
    return (
      <View style={styles.container}>
        <View style={styles.profile}>
          <Avatar style={{ width: 72, height: 72, backgroundColor: color.grey_5 }} target={avatar} />
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={styles.username}
          >
            {this.props.displayName}
          </Text>
          <Button
            text={this.props.removing ? 'Removing' : 'Remove Contact'}
            disabled={this.props.removing}
            onPress={this.onRemove}
          />
        </View>
        <ScrollView style={styles.threadsList}>
          <Text style={styles.threadsTitle}>
            {this.props.threadThumbs.length > 0 ? 'Sharing in Groups:' : 'Not part of any shared groups'}
          </Text>
          {this.props.threadThumbs.map((thread, i) => (
            <TouchableOpacity key={i} onPress={this.navigateToThread(thread.id)}>
            <PhotoWithTextBox key={i} text={thread.name} photo={thread.thumb} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  onRemove = () => {
    this.props.removeContact(this.props.address)
    this.props.navigation.goBack()
  }
}

const mapStateToProps = (state: RootState, ownProps: NavigationScreenProps<NavProps>): StateProps => {
  const username = ownProps.navigation.getParam('username')
  const address = ownProps.navigation.getParam('address')
  const removing = Object.keys(state.contacts.removingContacts).indexOf(address) > -1
  return {
    displayName: username ? username : address.substring(0, 12),
    threadThumbs: getThreadThumbs(state, address, 'name'),
    address,
    removing
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) : DispatchProps => {
  return {
    removeContact: (address: string) => dispatch(contactsActions.removeContactRequest(address))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactModal)
