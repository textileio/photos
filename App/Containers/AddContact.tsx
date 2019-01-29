import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  View,
  Text,
  SectionList,
  ViewStyle,
  SectionListRenderItemInfo,
  SectionListData
} from 'react-native'
import { NavigationScreenProps, NavigationActions } from 'react-navigation'
import Icon from '@textile/react-native-icon'
import { ContactInfo } from '@textile/react-native-sdk'

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

interface DispatchProps {
  search: (searchString: string) => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<{}>

class AddContact extends React.Component<Props> {

  static navigationOptions = ({ navigation }: NavigationScreenProps<{}>) => {
    const close = () => navigation.dispatch(NavigationActions.back())
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

  render () {
    return (
      <View style={CONTAINER}>
        <SectionList
          sections={this.props.searchResults}
          keyExtractor={this.keyExtractor}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderRow}
          ItemSeparatorComponent={RowSeparator}
          ListHeaderComponent={
            <SearchBar
              containerStyle={{ backgroundColor: '#FAFCFE' }}
              inputStyle={{ fontFamily: s.FONT_FAMILY_REGULAR, fontSize: s.FONT_SIZE_REGULAR, color: s.COLOR_FONT_DARK_ON_LIGHT_MEDIUM, backgroundColor: s.COLOR_GREY_LIGHT }}
              additionalInputProps={{ autoCapitalize: 'none', autoCorrect: false, spellCheck: false, autoFocus: true }}
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

  renderSectionHeader = ({section: { title }}: { section: SectionListData<SearchResultsSection> }) => {
    return <Text>{title}</Text>
  }

  renderRow = ({ item, section }: SectionListRenderItemInfo<SearchResult>) => {
    let title = ''
    let id = ''
    switch (item.type) {
      case 'textile':
        title = item.data.username || item.data.id
        id = item.data.id
        break
      case 'addressBook':
        title = item.data
        id = item.data
        break
      case 'error':
        title = item.data
        id = 'hmm' // TODO: What should this id be?
    }

    // const leftItem = <Avatar style={{ width: 50 }} target={item.avatar} />
    const rightItems = [<Icon key='more' name='chevron-right' size={24} color={s.COLOR_GREY_MEDIUM} />]
    return (
      <ListItem
        id={id}
        title={title}
        // leftItem={leftItem}
        rightItems={rightItems}
        onPress={this.onPress}
      />
    )
  }

  updateSearchString = (string?: string) => {
    if (string) {
      this.props.search(string)
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
    search: (searchString: string) => dispatch(ContactsActions.searchRequest(searchString))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddContact)
