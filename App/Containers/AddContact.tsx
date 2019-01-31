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
import { ContactInfo } from '@textile/react-native-sdk'
import Contacts from 'react-native-contacts'

import Button from '../Components/SmallButton'
import SearchBar from '../Components/SearchBar'
import RowSeparator from '../Components/RowSeparator'
import ListItem from '../Components/ListItem'
import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import { RootState, RootAction } from '../Redux/Types'
import ContactsActions, { ContactsSelectors, SearchResultsSection, SearchResult } from '../Redux/ContactsRedux'
import * as s from '../Themes/Constants'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: '#FAFCFE'
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
  addContact: (contactInfo: ContactInfo) => void
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
        <Item title='back' iconName='chevron-bottom' onPress={close} />
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
      containerStyle={{ backgroundColor: s.COLOR_GREY_LIGHT }}
      inputStyle={{ fontFamily: s.FONT_FAMILY_REGULAR, fontSize: s.FONT_SIZE_REGULAR, color: s.COLOR_FONT_DARK_ON_LIGHT_MEDIUM, backgroundColor: '#FAFCFE' }}
      additionalInputProps={{ autoCapitalize: 'none', autoCorrect: false, spellCheck: false, autoFocus: true }}
      iconColor={s.COLOR_GREY_MEDIUM}
      onTextChanged={this.updateSearchString}
    />
  )

  renderSectionHeader = ({section: { key, title }}: { section: SectionListData<SearchResultsSection> }) => {
    return (
      <Text
        key={key}
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
          fontFamily: s.FONT_FAMILY_BOLD,
          fontSize: s.FONT_SIZE_SMALL,
          color: s.COLOR_FONT_DARK_ON_LIGHT_MEDIUM,
          backgroundColor: s.COLOR_GREY_LIGHT
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
            leftItem={<Avatar style={{ width: 50 }} target={item.data.contactInfo.avatar} />}
            title={item.data.contactInfo.username || item.data.contactInfo.id}
            rightItems={[
              <Button
                key='add'
                text={item.data.isContact ? 'added' : 'add'}
                disabled={item.data.isContact || item.data.adding}
                onPress={this.onAdd(item.data.contactInfo)}
              />,
              <Icon key='more' name='chevron-right' size={24} color={s.COLOR_GREY_MEDIUM} />
            ]}
            onPress={this.onPressTextile(item.data.contactInfo)}
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
    // const rightItems = [<Icon key='more' name='chevron-right' size={24} color={s.COLOR_GREY_MEDIUM} />]
  }

  updateSearchString = (string?: string) => {
    if (string !== undefined && string.length > 0) {
      this.props.search(string)
    } else {
      this.props.clearSearch()
    }
  }

  onPressTextile = (contactInfo: ContactInfo) => {
    return () => this.props.navigation.navigate('Contact', { contactInfo })
  }

  onAdd = (contactInfo: ContactInfo) => {
    return () => this.props.addContact(contactInfo)
  }

  onPressAddressBook = (contact: Contacts.Contact) => {
    return () => {
      console.log('Pressed contact:', contact)
    }
  }

  onPress = (id: string) => {
    this.props.navigation.navigate('Contact', { peerId: id })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    searchResults: ContactsSelectors.searchResults(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    search: (searchString: string) => dispatch(ContactsActions.searchRequest(searchString)),
    clearSearch: () => dispatch(ContactsActions.clearSearch()),
    addContact: (contactInfo: ContactInfo) => dispatch(ContactsActions.addContactRequest(contactInfo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddContact)
