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
import { IContact } from '@textile/react-native-sdk'
import { orderedContacts } from '../features/contacts/selectors'

import SearchBar from '../Components/SearchBar'
import RowSeparator from '../Components/RowSeparator'
import ListItem from '../Components/ListItem'
import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import { RootState } from '../Redux/Types'
import { color, textStyle } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

interface StateProps {
  contacts: ReadonlyArray<IContact>
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
        <Item title='Add Contact' iconName='plus' onPress={addContact} />
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

  componentDidMount() {
    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
      addContact: this.inviteContactRequest
    })
  }

  render() {
    const allContacts: ReadonlyArray<IContact> = this.props.contacts
    let data = allContacts
    if (this.state.searchString !== undefined && this.state.searchString.length > 0) {
      data = data.filter((contact) => {
        const searchKey = (contact.name || contact.address).toLowerCase()
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
              containerStyle={{ backgroundColor: color.grey_5 }}
              inputStyle={{ ...textStyle.body_m, color: color.grey_2, backgroundColor: color.grey_6 }}
              additionalInputProps={{ autoCapitalize: 'none', autoCorrect: false, spellCheck: false }}
              iconColor={color.grey_4}
              onTextChanged={this.updateSearchString}
            />
          }
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
        />
      </View>
    )
  }

  keyExtractor = (item: IContact) => item.address

  renderRow = (row: ListRenderItemInfo<IContact>) => {
    const { item } = row
    const leftItem = <Avatar style={{ width: 50, height: 50, backgroundColor: color.grey_5 }} target={item.avatar} />
    const rightItems = [<Icon key='more' name='chevron-right' size={24} color={color.grey_4} />]
    return (
      <ListItem
        title={item.name || item.address.substring(0, 10)}
        leftItem={leftItem}
        rightItems={rightItems}
        onPress={this.onPress(item)}
      />
    )
  }

  updateSearchString = (string?: string) => {
    this.setState({
      searchString: string
    })
  }

  onPress = (contactInfo: IContact) => {
    return () => {
      this.props.navigation.navigate('Contact', { avatar: contactInfo.avatar, username: contactInfo.name, address: contactInfo.address })
    }
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
  return {
    contacts: orderedContacts(state.contacts)
  }
}

export default connect(mapStateToProps, undefined)(Contacts)
