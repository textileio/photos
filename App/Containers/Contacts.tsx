import React from 'react'
import { connect } from 'react-redux'
import {
  View,
  FlatList,
  ListRenderItemInfo,
  Keyboard
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import Icon from '@textile/react-native-icon'
import { ContactInfo } from '@textile/react-native-sdk'

import SearchBar from '../Components/SearchBar'
import RowSeparator from '../Components/RowSeparator'
import ListItem from '../Components/ListItem'
import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import InviteContactModal from '../Components/InviteContactModal'
import { RootState } from '../Redux/Types'
import * as s from '../Themes/Constants'

// Styles
import styles from './Styles/ContactsStyles'

interface StateProps {
  contacts: ReadonlyArray<ContactInfo>
}

interface NavProps {
  openDrawer: () => void
  addContact: () => void
}

type Props = StateProps & NavigationScreenProps<NavProps>

interface State {
  searchString?: string,
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
      showInviteContactModal: false
    }
  }

  selectContact (contact: ContactInfo) {
    return () => {
      this.setState({
        showInviteContactModal: false
      })
    }
  }

  updateSearchString = (string?: string) => {
    this.setState({
      searchString: string
    })
  }

  onPress = (id: string) => {
    this.props.navigation.navigate('Contact', { peerId: id })
  }

  renderRow = (row: ListRenderItemInfo<ContactInfo>) => {
    const { item } = row
    const leftItem = <Avatar style={{ width: 50 }} target={item.avatar} />
    const rightItems = [<Icon key='more' name='chevron-right' size={24} color={s.COLOR_GREY_MEDIUM} />]
    return (
      <ListItem
        id={item.id}
        title={item.username || item.id}
        leftItem={leftItem}
        rightItems={rightItems}
        onPress={this.onPress}
      />
    )
  }

  cancelInviteContact = () => {
    this.setState({showInviteContactModal: false})
  }

  inviteContactRequest = () => {
    this.setState({showInviteContactModal: true})
  }

  openDrawer = () => {
    this.props.navigation.openDrawer()
    Keyboard.dismiss()
  }

  keyExtractor = (item: ContactInfo) => item.id

  componentDidMount () {
    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
      addContact: this.inviteContactRequest
    })
  }

  render () {
    const allContacts: ReadonlyArray<ContactInfo> = this.props.contacts
    let data = allContacts
    if (this.state.searchString !== undefined && this.state.searchString.length > 0) {
      data = data.filter((contact) => {
        const searchKey = (contact.username || contact.id).toLowerCase()
        const index = searchKey.indexOf(this.state.searchString!.toLowerCase())
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
              additionalInputProps={{ autoCapitalize: 'none', autoCorrect: false, spellCheck: false }}
              iconColor={s.COLOR_GREY_MEDIUM}
              onTextChanged={this.updateSearchString}
            />
          }
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
        />
        <InviteContactModal
          isVisible={this.state.showInviteContactModal}
          cancel={this.cancelInviteContact}
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

export default connect(mapStateToProps, undefined)(Contacts)
