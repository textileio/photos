import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity, ListRenderItemInfo, Platform
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import Icon from '@textile/react-native-icon'

import SearchBar from '../Components/SearchBar'
import RowSeparator from '../Components/RowSeparator'
import ListItem from '../Components/ListItem'
import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import ContactModal from '../Components/ContactModal'
import InviteContactModal from '../Components/InviteContactModal'

import { RootAction, RootState } from '../Redux/Types'
import ProcessingImagesActions from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'

import { ContactInfo } from '@textile/react-native-sdk'

import * as s from '../Themes/Constants'

// Styles
import styles, { PRODUCT_ITEM_HEIGHT } from './Styles/ContactsStyles'

interface DispatchProps {
  cancelShare: (uuid: string) => void
  navigateToThread: (id: string, name: string) => void
  retryShare: (uuid: string) => void
}

interface StateProps {
  contacts: ReadonlyArray<ContactInfo>
}

interface NavProps {
  openDrawer: () => void
  addContact: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  searchString?: string,
  contactCard: boolean,
  selectedContact?: string,
  selectedUsername?: string,
  selectedAvatar?: string,
  showInviteContactModal: boolean
}

class Contacts extends React.Component<Props, State> {

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavProps>) => {
    const openDrawer = navigation.getParam('openDrawer')
    const addContact = navigation.getParam('addContact')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item
          title='Account'
          onPress={openDrawer}
          ButtonElement={<Avatar style={{ width: 24, height: 24 }} self={true} />}
          buttonWrapperStyle={{ margin: 11 }}
        />
      </TextileHeaderButtons>
    )

    const headerRight = (
      <TextileHeaderButtons>
        <Item iconName='plus' onPress={addContact} />
      </TextileHeaderButtons>
    )

    return {
      headerTitle: 'Contacts',
      headerLeft,
      headerRight
    }
  }

  oneScreensWorth = 40

  constructor(props: Props) {
    super(props)
    this.state = {
      contactCard: false,
      showInviteContactModal: false
    }
  }

  selectContact (contact: ContactInfo) {
    return () => {
      this.setState({
        selectedContact: contact.id,
        selectedUsername: contact.username,
        selectedAvatar: contact.avatar,
        contactCard: true
      })
    }
  }

  closeModal () {
    return () => {
      this.setState({contactCard: false})
    }
  }

  navigateToThread () {
    return (id: string, name: string) => {
      this.setState({contactCard: false})
      this.props.navigateToThread(id, name)
    }
  }

  updateSearchString = (string?: string) => {
    this.setState({
      searchString: string
    })
  }

  onPress = (id: string) => {
    console.log('PRESSED:', id)
  }

  renderRow = (row: ListRenderItemInfo<ContactInfo>) => {
    const { item } = row
    return (
      <ListItem
        id={item.id}
        title={item.username || item.id}
        renderLeftItem={() => <Avatar style={{ width: 60 }} target={item.avatar} />}
        renderRightItems={() => [<Icon name='chevron-right' size={24} color={s.COLOR_GREY_MEDIUM} />]}
        onPress={this.onPress}
      />
    )
  }

  cancelInviteContact () {
    return () => {
      this.setState({showInviteContactModal: false})
    }
  }

  inviteContactRequest () {
    return () => {
      this.setState({showInviteContactModal: true})
    }
  }

  openDrawer = () => {
    this.props.navigation.openDrawer()
  }

  keyExtractor = (item: ContactInfo) => item.id

  componentDidMount () {
    this.props.navigation.setParams({
      openDrawer: this.openDrawer
    })
  }

  render () {
    const allContacts: ReadonlyArray<ContactInfo> = this.props.contacts
    let data = allContacts
    if (this.state.searchString !== undefined && this.state.searchString.length > 0) {
      data = data.filter((contact) => {
        const searchKey = contact.username || contact.id
        const index = searchKey.indexOf(this.state.searchString!)
        return index > -1
      })
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.listContainer}
          data={data}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderRow}
          ItemSeparatorComponent={RowSeparator}
          ListHeaderComponent={
            <SearchBar
              containerStyle={{ backgroundColor: '#FAFCFE' }}
              inputStyle={{ fontFamily: s.FONT_FAMILY_REGULAR, fontSize: s.FONT_SIZE_REGULAR, color: s.COLOR_FONT_DARK_ON_LIGHT_MEDIUM, backgroundColor: s.COLOR_GREY_LIGHT }}
              iconColor={s.COLOR_GREY_MEDIUM}
              onTextChanged={this.updateSearchString}
            />
          }
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
        />
        {/* <ContactModal
          isVisible={this.state.contactCard}
          peerId={this.state.selectedContact}
          username={this.state.selectedUsername}
          avatar={this.state.selectedAvatar}
          navigateToThread={this.navigateToThread()}
          close={this.closeModal()}
        /> */}
        <InviteContactModal
          isVisible={this.state.showInviteContactModal}
          cancel={this.cancelInviteContact()}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const contacts = state.contacts.contacts.slice().sort((a, b) => {
    const aSortKey = a.username || a.id
    const bSortKey = b.username || b.id
    if (aSortKey < bSortKey) {
      return -1
    } else if (aSortKey > bSortKey) {
      return 1
    } else {
      return 0
    }
  })
  return {
    contacts
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    retryShare: (uuid: string) => { dispatch(ProcessingImagesActions.retry(uuid)) },
    cancelShare: (uuid: string) => { dispatch(ProcessingImagesActions.cancelRequest(uuid)) },
    navigateToThread: (id: string, name: string) => {
      dispatch(UIActions.navigateToThreadRequest(id, name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts)
