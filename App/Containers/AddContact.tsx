import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  View,
  Text,
  SectionList,
  ViewStyle,
  SectionListRenderItemInfo,
  SectionListData,
  ActivityIndicator
} from 'react-native'
import { NavigationScreenProps, NavigationActions } from 'react-navigation'
import Icon from '@textile/react-native-icon'
import { pb } from '@textile/react-native-sdk'
import Contacts from 'react-native-contacts'

import Button from '../Components/SmallButton'
import SearchBar from '../Components/SearchBar'
import RowSeparator from '../Components/RowSeparator'
import ListItem from '../Components/ListItem'
import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import { RootState, RootAction } from '../Redux/Types'
import { contactsActions, contactsSelectors } from '../features/contacts'
import { SearchResultsSection, SearchResult } from '../features/contacts/models'
import { color, textStyle, spacing } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

interface StateProps {
  searchResults: SearchResultsSection[]
}

interface NavProps {
  clearSearch: () => void
}

interface DispatchProps {
  search: (searchString: string) => void
  clearSearch: () => void
  addContact: (contact: pb.IContact) => void
  inviteContact: (contact: Contacts.Contact) => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

class AddContact extends React.Component<Props> {

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavProps>) => {
    const close = () => {
      navigation.getParam('clearSearch')()
      navigation.dispatch(NavigationActions.back())
    }
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Close' iconName='chevron-bottom' onPress={close} />
      </TextileHeaderButtons>
    )
    return {
      headerTitle: 'Add Contact',
      headerRight
    }
  }

  constructor(props: Props) {
    super(props)
    // this._headerComponent = this._headerComponent.bind(this)
    // this.updateSearchString = this.updateSearchString.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      clearSearch: this.props.clearSearch
    })
  }

  render () {
    return (
      <View style={CONTAINER}>
        {this._headerComponent()}
        <SectionList
          sections={this.props.searchResults}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderRow}
          ItemSeparatorComponent={RowSeparator}
          // ListHeaderComponent={this._headerComponent}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
        />
      </View>
    )
  }

  _headerComponent = () => (
    <SearchBar
      containerStyle={{ backgroundColor: color.grey_5 }}
      inputStyle={{ ...textStyle.body_m, color: color.grey_2, backgroundColor: color.grey_6 }}
      additionalInputProps={{ autoCapitalize: 'none', autoCorrect: false, spellCheck: false, autoFocus: true }}
      iconColor={color.grey_4}
      onTextChanged={this.updateSearchString}
    />
  )

  renderSectionHeader = ({section: { key, title }}: { section: SectionListData<SearchResultsSection> }) => {
    return (
      <Text
        key={key}
        style={{
          ...textStyle.header_xs,
          paddingTop: spacing._008,
          paddingBottom: spacing._008,
          paddingLeft: spacing._012,
          paddingRight: spacing._012,
          color: color.grey_2,
          backgroundColor: color.grey_5
        }}
      >
        {title}
      </Text>
    )
  }

  renderRow = ({ item, index, section }: SectionListRenderItemInfo<SearchResult>) => {
    switch (item.type) {
      case 'loading':
        return <ActivityIndicator size='small' style={{ padding: 11 }} />
      case 'textile':
        return (
          <ListItem
            leftItem={<Avatar style={{ width: 50 }} target={item.data.contact.avatar} />}
            title={item.data.contact.username || item.data.contact.id}
            subtitle={item.data.contact.id.substr(item.data.contact.id.length - 8, 8)}
            rightItems={[
              <Button
                key='add'
                text={item.data.isContact ? 'added' : 'add'}
                disabled={item.data.isContact || item.data.adding}
                onPress={this.onAdd(item.data.contact)}
              />,
              <Icon key='more' name='chevron-right' size={24} color={color.grey_4} />
            ]}
            onPress={this.onPressTextile(item.data.contact)}
          />
        )
      case 'addressBook':
        return (
          <ListItem
            title={`${item.data.givenName} ${item.data.familyName}`.trim()}
            rightItems={[<Button key='invite' text='invite' onPress={this.onPressAddressBook(item.data)} />]}
            onPress={this.onPressAddressBook(item.data)}
          />
        )
      case 'empty':
        return (
          <ListItem
            title='No results'
          />
        )
      case 'error':
        return (
          <ListItem
            title='Error'
            subtitle={item.data}
          />
        )
    }
    // const leftItem = <Avatar style={{ width: 50 }} target={item.avatar} />
    // const rightItems = [<Icon key='more' name='chevron-right' size={24} color={color.grey_4} />]
  }

  updateSearchString = (string?: string) => {
    if (string !== undefined && string.length > 0) {
      this.props.search(string)
    } else {
      this.props.clearSearch()
    }
  }

  onPressTextile = (contact: pb.IContact) => {
    return () => this.props.navigation.navigate('Contact', { avatar: contact.avatar, username: contact.username, peerId: contact.id })
  }

  onAdd = (contact: pb.IContact) => {
    return () => this.props.addContact(contact)
  }

  onPressAddressBook = (contact: Contacts.Contact) => {
    return () => {
      this.props.inviteContact(contact)
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    searchResults: contactsSelectors.searchResults(state.contacts)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    search: (searchString: string) => dispatch(contactsActions.searchRequest(searchString)),
    clearSearch: () => dispatch(contactsActions.clearSearch()),
    addContact: (contact: pb.IContact) => dispatch(contactsActions.addContactRequest(contact)),
    inviteContact: (contact: Contacts.Contact) => dispatch(contactsActions.authorInviteRequest(contact))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddContact)
