import React from 'react'
import { connect } from 'react-redux'
import {
  View,
  FlatList,
  ListRenderItemInfo,
  Keyboard,
  ViewStyle
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

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: '#FAFCFE'
}

interface StateProps {
  contacts: ReadonlyArray<ContactInfo>
}

interface NavProps {
  openDrawer: () => void
  addContact: () => void
}

type Props = StateProps & NavigationScreenProps<NavProps>

interface State {
  searchString?: string
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

  constructor(props: Props) {
    super(props)
    this.state = {}
  }

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
      <View style={CONTAINER}>
        <FlatList
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
      </View>
    )
  }

  keyExtractor = (item: ContactInfo) => item.id

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

  updateSearchString = (string?: string) => {
    this.setState({
      searchString: string
    })
  }

  onPress = (id: string) => {
    this.props.navigation.navigate('Contact', { peerId: id })
  }

  inviteContactRequest = () => {
    this.props.navigation.navigate('AddContact')
  }

  openDrawer = () => {
    this.props.navigation.openDrawer()
    Keyboard.dismiss()
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
