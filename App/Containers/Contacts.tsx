import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  Keyboard,
  ViewStyle,
  TextStyle,
  SectionList,
  SectionListRenderItemInfo,
  SectionListData,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { NavigationScreenProps, NavigationActions } from 'react-navigation'
import Icon from '@textile/react-native-icon'
import { IContact } from '@textile/react-native-sdk'
import { Contact } from 'react-native-contacts'

import { RootState, RootAction } from '../Redux/Types'

import { contactsActions, contactsSelectors } from '../features/contacts'
import {
  SearchResultsSection,
  SearchResult,
  ContactSearchResult
} from '../features/contacts/models'
import { orderedContacts } from '../features/contacts/selectors'

import Button from '../Components/SmallButton'
import SearchBar from '../Components/SearchBar'
import RowSeparator from '../Components/RowSeparator'
import ListItem from '../Components/ListItem'
import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import { color, textStyle, fontFamily, spacing } from '../styles'
import { contact } from '@textile/react-native-sdk/dist/account'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

const selectingText: TextStyle = {
  paddingRight: 15,
  fontFamily: fontFamily.medium
}

interface StateProps {
  contacts: ReadonlyArray<IContact>
  searchResults: SearchResultsSection[]
}

interface NavProps {
  openDrawer: () => void
  addContact: () => void
  clearSearch: () => void
  toggleSelect: () => void
  selecting: boolean
}

interface DispatchProps {
  search: (searchString: string) => void
  clearSearch: () => void
  addContact: (contact: IContact) => void
  inviteContact: (contact: Contact) => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  searchString?: string
}

class Contacts extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const openDrawer = navigation.getParam('openDrawer')
    const selecting = navigation.getParam('selecting')
    const toggleSelect = navigation.getParam('toggleSelect')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item
          title="Account"
          onPress={openDrawer}
          ButtonElement={
            <Avatar style={{ width: 24, height: 24 }} self={true} />
          }
          buttonWrapperStyle={{ margin: 11 }}
        />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TouchableOpacity onPress={toggleSelect}>
        <Text style={selectingText}>{selecting ? 'Cancel' : 'New Group'}</Text>
      </TouchableOpacity>
    )
    return {
      headerTitle: 'Contacts',
      headerLeft,
      headerRight
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
      clearSearch: this.props.clearSearch,
      toggleSelect: this.toggleSelect,
      selecting: false
    })
  }

  contactsSearchResultSection = () => {
    const contacts: SearchResult[] = this.props.contacts
      .filter(contact => {
        if (
          this.state.searchString !== undefined &&
          this.state.searchString.length > 0
        ) {
          const searchKey = (contact.name || contact.address).toLowerCase()
          const index = searchKey.indexOf(
            this.state.searchString!.toLowerCase()
          )
          return index > -1
        } else {
          return true
        }
      })
      .map(contact => {
        const contactResult: ContactSearchResult = {
          key: contact.address,
          type: 'contact',
          data: contact
        }
        return contactResult
      })
    return {
      key: 'contacts',
      title: 'Your Contacts',
      data:
        contacts.length > 0
          ? contacts
          : [
            {
              key: 'textile_empty',
              type: 'empty'
            }
          ]
    }
  }

  render() {
    return (
      <View style={CONTAINER}>
        <SearchBar
          containerStyle={{ backgroundColor: color.grey_5 }}
          inputStyle={{
            ...textStyle.body_m,
            color: color.grey_2,
            backgroundColor: color.grey_6
          }}
          additionalInputProps={{
            autoCapitalize: 'none',
            autoCorrect: false,
            spellCheck: false
          }}
          iconColor={color.grey_4}
          onTextChanged={this.updateSearchString}
          placeholder="Search or add new contact..."
        />
        <SectionList
          sections={[
            this.contactsSearchResultSection(),
            ...this.props.searchResults
          ]}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderRow}
          ItemSeparatorComponent={RowSeparator}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </View>
    )
  }

  renderSectionHeader = ({
    section: { key, title }
  }: {
    section: SectionListData<SearchResultsSection>
  }) => {
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

  renderRow = ({
    item,
    index,
    section
  }: SectionListRenderItemInfo<SearchResult>) => {
    switch (item.type) {
      case 'loading':
        return <ActivityIndicator size="small" style={{ padding: 11 }} />
      case 'contact': {
        const contact = item.data
        const leftItem = (
          <Avatar
            style={{ width: 50, height: 50, backgroundColor: color.grey_5 }}
            target={contact.avatar}
          />
        )
        const rightItems = [
          <Icon
            key="more"
            name="chevron-right"
            size={24}
            color={color.grey_4}
          />
        ]
        return (
          <ListItem
            title={contact.name || contact.address.substring(0, 10)}
            leftItem={leftItem}
            rightItems={rightItems}
            onPress={this.onPressTextile(contact)}
          />
        )
      }
      case 'textile':
        return (
          <ListItem
            leftItem={
              <Avatar style={{ width: 50 }} target={item.data.contact.avatar} />
            }
            title={item.data.contact.name || item.data.contact.address}
            subtitle={item.data.contact.address.substr(
              item.data.contact.address.length - 8,
              8
            )}
            rightItems={[
              <Button
                key="add"
                text={item.data.isContact ? 'added' : 'add'}
                disabled={item.data.isContact || item.data.adding}
                onPress={this.onAdd(item.data.contact)}
              />,
              <Icon
                key="more"
                name="chevron-right"
                size={24}
                color={color.grey_4}
              />
            ]}
            onPress={this.onPressTextile(item.data.contact)}
          />
        )
      case 'addressBook':
        return (
          <ListItem
            title={`${item.data.givenName} ${item.data.familyName}`.trim()}
            rightItems={[
              <Button
                key="invite"
                text="invite"
                onPress={this.onPressAddressBook(item.data)}
              />
            ]}
            onPress={this.onPressAddressBook(item.data)}
          />
        )
      case 'empty':
        return <ListItem title="No results" />
      case 'error':
        return <ListItem title="Error" subtitle={item.data} />
    }
  }

  updateSearchString = (string?: string) => {
    this.setState({
      searchString: string
    })
    if (string !== undefined && string.length > 0) {
      this.props.search(string)
    } else {
      this.props.clearSearch()
    }
  }

  onPressTextile = (contactInfo: IContact) => {
    return () => {
      this.props.navigation.navigate('Contact', { contact: contactInfo })
    }
  }

  onPressAddressBook = (contact: Contact) => {
    return () => {
      this.props.inviteContact(contact)
    }
  }

  onAdd = (contact: IContact) => {
    return () => this.props.addContact(contact)
  }

  openDrawer = () => {
    this.props.navigation.openDrawer()
    Keyboard.dismiss()
  }

  toggleSelect = () => {
    this.props.navigation.setParams({
      selecting: !this.props.navigation.getParam('selecting')
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    contacts: orderedContacts(state.contacts),
    searchResults: contactsSelectors.searchResults(state.contacts)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    search: (searchString: string) =>
      dispatch(contactsActions.searchRequest(searchString)),
    clearSearch: () => dispatch(contactsActions.clearSearch()),
    addContact: (contact: IContact) =>
      dispatch(contactsActions.addContactRequest(contact)),
    inviteContact: (contact: Contact) =>
      dispatch(contactsActions.authorInviteRequest(contact))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contacts)
