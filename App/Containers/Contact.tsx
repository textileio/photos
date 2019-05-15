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
import { IContact } from '@textile/react-native-sdk'

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
  contact: IContact
}

interface StateProps {
  displayName: string
  threadThumbs: ReadonlyArray<ThreadThumbs>
  isContact: boolean
  removing: boolean
  adding: boolean
}

interface DispatchProps {
  removeContact: (address: string) => void
  addContact: (contact: IContact) => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

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
    const avatar = this.props.navigation.getParam('contact').avatar
    const removingText = this.props.removing ? 'Removing' : 'Remove'
    const addingText = this.props.adding ? 'Adding' : 'Add'
    const buttonText = this.props.isContact ? removingText : addingText
    const buttonDisabled = this.props.adding || this.props.removing
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
            text={buttonText}
            disabled={buttonDisabled}
            onPress={this.props.isContact ? this.onRemove : this.onAdd}
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
    this.props.removeContact(this.props.navigation.getParam('contact').address)
  }

  onAdd = () => {
    this.props.addContact(this.props.navigation.getParam('contact'))
  }
}

const mapStateToProps = (state: RootState, ownProps: NavigationScreenProps<NavProps>): StateProps => {
  const contact = ownProps.navigation.getParam('contact')
  const username = contact.name
  const address = contact.address
  // Check if this contact is already added
  const isContact = state.contacts.contacts.some((c) => c.address === address)
  // Check if this contact is currently being removed
  const removing = Object.keys(state.contacts.removingContacts).indexOf(address) > -1
  // Check if this contact is currently being added
  const adding = Object.keys(state.contacts.addingContacts).indexOf(address) > -1
  return {
    displayName: username ? username : address.substring(0, 12),
    threadThumbs: getThreadThumbs(state, address, 'name'),
    isContact,
    removing,
    adding
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: NavigationScreenProps<NavProps>): DispatchProps => {
  const contact = ownProps.navigation.getParam('contact')
  const address = contact.address
  return {
    removeContact: () => dispatch(contactsActions.removeContactRequest(address)),
    addContact: () => dispatch(contactsActions.addContactRequest(contact))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactModal)
