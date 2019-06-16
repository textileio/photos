import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { IContact, Thread } from '@textile/react-native-sdk'
import {
  TabView,
  SceneMap,
  NavigationState,
  TabBar
} from 'react-native-tab-view'

// Components
import Avatar from '../Components/Avatar'
import Button from '../Components/LargeButton'
import PhotoWithTextBox from '../SB/components/PhotoWithTextBox'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'

// Styles
import styles from '../Components/Styles/ContactModal'
import { color, spacing, fontFamily, fontSize } from '../styles'

// Redux
import { RootState, RootAction } from '../Redux/Types'
import PhotoViewingActions, {
  ThreadThumbs,
  ThreadData
} from '../Redux/PhotoViewingRedux'
import {
  getThreadThumbs,
  getDirectMessageThread
} from '../Redux/PhotoViewingSelectors'
import { contactsActions } from '../features/contacts'
import { cafes } from '../features/contacts/selectors'

const container: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: color.screen_primary
}

const profile: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingVertical: spacing._024
}

const profilePicture: ImageStyle = {
  width: spacing._128,
  height: spacing._128,
  backgroundColor: color.grey_5,
  marginBottom: spacing._024
}

const username: TextStyle = {
  textAlign: 'center',
  fontFamily: fontFamily.bold,
  fontSize: fontSize._30,
  marginBottom: spacing._024
}

const buttons: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
}

const addOrRemoveButton: ViewStyle = {
  marginRight: spacing._012
}

const cafesList: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing._016,
  paddingTop: spacing._024
}

const cafesHeader: TextStyle = {
  fontFamily: fontFamily.bold,
  fontSize: fontSize._16,
  marginBottom: spacing._012
}

const cafeTitle: TextStyle = {
  fontFamily: fontFamily.regular,
  fontSize: fontSize._14,
  marginVertical: spacing._012
}

const cafeBox: ViewStyle = {}

const divider: ViewStyle = {
  width: '100%',
  height: 1,
  backgroundColor: color.grey_4
}

const tabView: ViewStyle = {
  flex: 1,
  width: Dimensions.get('window').width
}

const tabBarStyle: ViewStyle = {
  backgroundColor: color.screen_primary
}

const indicatorStyle: ViewStyle = {
  backgroundColor: color.grey_3
}

const tab: ViewStyle = {
  flex: 1
}

interface NavProps {
  contact: IContact
}

interface StateProps {
  displayName: string
  threadThumbs: ReadonlyArray<ThreadThumbs>
  isContact: boolean
  removing: boolean
  adding: boolean
  directMessageThread: ThreadData | undefined
}

interface DispatchProps {
  removeContact: () => void
  addContact: () => void
  createDirectMessageThread: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

type Route = {
  key: string
  title: string
}

type State = NavigationState<Route>

class ContactModal extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const back = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" iconName="arrow-left" onPress={back} />
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

  constructor(props: Props) {
    super(props)
    this.state = {
      index: 0,
      routes: [
        {
          key: 'threads',
          title: 'Threads'
        },
        {
          key: 'cafes',
          title: 'Cafes'
        }
      ]
    }
  }

  render() {
    const contact = this.props.navigation.getParam('contact')
    const avatar = contact.avatar
    const removingText = this.props.removing ? 'Removing' : 'Remove'
    const addingText = this.props.adding ? 'Adding' : 'Add'
    const buttonText = this.props.isContact ? removingText : addingText
    const buttonDisabled = this.props.adding || this.props.removing
    const cafeObjects = cafes(contact)
    const ThreadsScreen = (
      <ScrollView style={styles.threadsList}>
        <Text style={styles.threadsTitle}>
          {this.props.threadThumbs.length > 0
            ? 'Sharing in Groups:'
            : 'Not part of any shared groups'}
        </Text>
        {this.props.threadThumbs.map((thread, i) => (
          <TouchableOpacity key={i} onPress={this.navigateToThread(thread.id)}>
            <PhotoWithTextBox key={i} text={thread.name} photo={thread.thumb} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
    const CafesScreen = (
      <ScrollView style={cafesList}>
        <Text style={cafesHeader}>Registered With the Following Cafes:</Text>
        {cafeObjects.map((cafe, i) => (
          <View key={i} style={cafeBox}>
            <Text style={cafeTitle}>{cafe.address}</Text>
            {i !== cafeObjects.length - 1 && <View style={divider} />}
          </View>
        ))}
      </ScrollView>
    )
    return (
      <SafeAreaView style={container}>
        <View style={profile}>
          <Avatar style={profilePicture} target={avatar} />
          <Text style={username}>{this.props.displayName}</Text>
          <View style={buttons}>
            <Button
              text={buttonText}
              style={{
                ...addOrRemoveButton,
                backgroundColor: this.props.isContact
                  ? color.severe_3
                  : color.action_3
              }}
              disabled={buttonDisabled}
              onPress={this.props.isContact ? this.onRemove : this.onAdd}
            />
            <Button
              text={'Send Message'}
              onPress={this.createOrNavigateToDirectMessageThread}
            />
          </View>
        </View>
        <TabView<Route>
          style={tabView}
          navigationState={this.state}
          renderScene={SceneMap({
            threads: () => ThreadsScreen,
            cafes: () => CafesScreen
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{
            width: Dimensions.get('window').width
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={tabBarStyle}
              indicatorStyle={indicatorStyle}
              activeColor={color.grey_1}
              inactiveColor={color.grey_3}
            />
          )}
        />
      </SafeAreaView>
    )
    /* return (
  <View style={styles.container}>
      <View style={styles.profile}>
        <Avatar
          style={{ width: 72, height: 72, backgroundColor: color.grey_5 }}
          target={avatar}
        />
        <Text style={styles.username}>{this.props.displayName}</Text>
        <View style={buttons}>
          <Button
            text={buttonText}
            style={{
              ...addOrRemoveButton,
              backgroundColor: this.props.isContact
                ? color.severe_3
                : color.action_3
            }}
            disabled={buttonDisabled}
            onPress={this.props.isContact ? this.onRemove : this.onAdd}
          />
          <Button
            text={'Send Message'}
            onPress={this.createOrNavigateToDirectMessageThread}
          />
        </View>
      </View>
      <ScrollView style={styles.threadsList}>
        <Text style={styles.threadsTitle}>
          {this.props.threadThumbs.length > 0
            ? 'Sharing in Groups:'
            : 'Not part of any shared groups'}
        </Text>
        {this.props.threadThumbs.map((thread, i) => (
          <TouchableOpacity
            key={i}
            onPress={this.navigateToThread(thread.id)}
          >
            <PhotoWithTextBox
              key={i}
              text={thread.name}
              photo={thread.thumb}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={cafesList}>
        <Text style={cafesHeader}>Registered With the Following Cafes:</Text>
        {cafes(contact).map((cafe, i) => (
          <Text key={i} style={cafesTitle}>
            {cafe.address}
          </Text>
        ))}
      </ScrollView>
    </View>
    )*/
  }

  onRemove = () => {
    this.props.removeContact()
  }

  onAdd = () => {
    this.props.addContact()
  }

  createOrNavigateToDirectMessageThread = () => {
    if (this.props.directMessageThread) {
      // Navigate to direct message thread
      const { id, name } = this.props.directMessageThread
      this.props.navigation.navigate('ViewThread', {
        threadId: id,
        groupName: name
      })
    } else {
      this.props.createDirectMessageThread()
    }
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: NavigationScreenProps<NavProps>
): StateProps => {
  const contact = ownProps.navigation.getParam('contact')
  const username = contact.name
  const address = contact.address
  // Check if this contact is already added
  const isContact = state.contacts.contacts.some(c => c.address === address)
  // Check if this contact is currently being removed
  const removing =
    Object.keys(state.contacts.removingContacts).indexOf(address) > -1
  // Check if this contact is currently being added
  const adding =
    Object.keys(state.contacts.addingContacts).indexOf(address) > -1
  const directMessageThread = getDirectMessageThread(state, address)
  return {
    displayName: username ? username : address.substring(0, 12),
    threadThumbs: getThreadThumbs(state, address, 'name'),
    isContact,
    removing,
    adding,
    directMessageThread
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: NavigationScreenProps<NavProps>
): DispatchProps => {
  const contact = ownProps.navigation.getParam('contact')
  const { address, name } = contact
  const threadConfig = {
    name,
    whitelist: [address],
    type: Thread.Type.OPEN,
    sharing: Thread.Sharing.NOT_SHARED
  }
  return {
    removeContact: () =>
      dispatch(contactsActions.removeContact.request(address)),
    addContact: () => dispatch(contactsActions.addContactRequest(contact)),
    createDirectMessageThread: () =>
      dispatch(
        PhotoViewingActions.addThreadRequest(threadConfig, { navigate: true })
      )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactModal)
