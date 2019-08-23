import React, { Fragment } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  ViewStyle,
  TextStyle,
  Platform,
  ImageStyle
} from 'react-native'
import Avatar from '../../../Components/Avatar'

import ContactSelectCard, { ContactLinkCard } from './ContactSelectCard'

import styles from './statics/styles'
import { IContact } from '@textile/react-native-sdk'
import Icon from '@textile/react-native-icon'
import { color, size, fontSize } from '../../../styles'
import ListItem from '../../../Components/ListItem'

function getSubTitle(
  contacts: IncludedContact[],
  topFive: IncludedContact[],
  notInThread: boolean
) {
  if (contacts.length === 0) {
    return 'You don\'t have any contacts.'
  } else if (topFive.length > 0 && topFive.length > 0 && notInThread) {
    return 'Suggested:'
  }
  return 'Invite existing contacts or generate an external invite link or QR code.'
}

export interface IncludedContact extends IContact {
  type: string
  included: boolean
}

interface ContactSelectComponentProps {
  findNearby: () => void
  copyToClipboard: () => void
  getPublicLink: () => void
  displayQRCode: () => void
  select: (item: IncludedContact, included: boolean) => void
  selected: { [key: string]: boolean }
  contacts: IncludedContact[]
}

interface ContactSelectProps extends ContactSelectComponentProps {
  threadName: string
  notInThread: boolean
  topFive: IncludedContact[]
}

// puts a placeholder row in contacts for adding external invite link
const ContactSelect = (props: ContactSelectProps) => {
  const {
    findNearby,
    copyToClipboard,
    getPublicLink,
    displayQRCode,
    contacts,
    select,
    selected,
    topFive,
    notInThread,
    threadName
  } = props
  const subTitle = getSubTitle(contacts, topFive, notInThread)
  const showSuggested = topFive.length > 0 && notInThread

  const title =
    threadName && threadName !== ''
      ? `Invite to ${threadName}`
      : 'Invite others'

  const onPress = (item: IncludedContact) => {
    return () => {
      select(item, item.included)
    }
  }

  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {subTitle && <Text style={styles.subtitle}>{subTitle}</Text>}

        {showSuggested && (
          <View style={styles.selectedContactList}>
            {topFive.map(item => {
              // const item = contacts.find(c => c.id === id)
              if (!item) {
                return <View />
              }

              const selectState =
                Boolean(selected[item.address]) || item.included

              return (
                <TouchableOpacity
                  key={item.address}
                  activeOpacity={0.6}
                  style={styles.selectedContact}
                  onPress={onPress(item)}
                >
                  <Avatar style={styles.selectedContact} target={item.avatar} />
                  {selectState && (
                    <Image
                      style={styles.selectedContactIcon}
                      source={require('./statics/icon-select.png')}
                    />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.searchBoxPlaceholder} />
        <ContactSelectComponent
          findNearby={findNearby}
          contacts={contacts}
          selected={selected}
          select={select}
          copyToClipboard={copyToClipboard}
          getPublicLink={getPublicLink}
          displayQRCode={displayQRCode}
        />
      </View>
    </View>
  )
}

export class ContactSelectComponent extends React.Component<
  ContactSelectComponentProps
> {
  renderHeader = () => {
    const nearby = Platform.OS === 'ios'
    const columns = nearby ? 4 : 3
    const borderBottom =
      this.props.contacts.length === 0
        ? {}
        : { borderBottomWidth: 1, borderColor: '#ECEDEE' }
    const HEADER_ROW: ViewStyle = {
      flexDirection: 'row',
      paddingVertical: size._024,
      ...borderBottom
    }
    const HEADER_OPTION: ViewStyle = {
      flex: 1 / columns,
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'flex-start'
    }
    const HEADER_OPTION_LABEL: TextStyle = {
      textAlign: 'center',
      fontSize: fontSize._12,
      color: color.action_4,
      paddingTop: 12
    }
    const ICON_COLOR = color.action_4
    return (
      <View style={HEADER_ROW}>
        {nearby && (
          <TouchableOpacity
            style={HEADER_OPTION}
            activeOpacity={0.85}
            onPress={this.props.findNearby}
          >
            <Icon name={'wi-fi_16'} size={26} color={ICON_COLOR} />
            <Text style={HEADER_OPTION_LABEL}>Nearby</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={HEADER_OPTION}
          activeOpacity={0.85}
          onPress={this.props.getPublicLink}
        >
          <Icon name={'share-arrow'} size={26} color={ICON_COLOR} />
          <Text style={HEADER_OPTION_LABEL}>Share Link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={HEADER_OPTION}
          activeOpacity={0.85}
          onPress={this.props.displayQRCode}
        >
          <Icon name={'scan'} size={26} color={ICON_COLOR} />
          <Text style={HEADER_OPTION_LABEL}>Display QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={HEADER_OPTION}
          activeOpacity={0.85}
          onPress={this.props.copyToClipboard}
        >
          <Icon name={'clipboard-plus'} size={26} color={ICON_COLOR} />
          <Text style={HEADER_OPTION_LABEL}>Copy Link</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderFooter = () => {
    const BUFFER: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 11,
      width: '100%',
      minHeight: 120
    }
    // Provides a quick fix until this layout is replaces.
    // Without it the bottom two rows are sometimes not selectable.
    return <View style={BUFFER} />
  }

  renderRow = (contact: ListRenderItemInfo<IncludedContact>) => {
    const { item } = contact
    const selectState =
      Boolean(this.props.selected[item.address]) || item.included
    return (
      <ContactSelectCard
        item={item}
        select={this.props.select}
        selected={selectState}
      />
    )
  }

  renderContact = (row: ListRenderItemInfo<IncludedContact>) => {
    const { item } = row
    const selectState =
      Boolean(this.props.selected[item.address]) || item.included
    const AVATAR_STYLE: ImageStyle = {
      width: 50,
      height: 50,
      backgroundColor: color.grey_5
    }
    return (
      <ListItem
        title={item.name || item.address.substring(0, 10)}
        leftItem={<Avatar style={AVATAR_STYLE} target={item.avatar} />}
        showDisclosure={true}
        selecting={true}
        selected={selectState}
        // onPress={this.onPressTextile(contact)}
        onSelect={() => this.props.select(item, item.included)}
        invert={true}
      />
    )
  }

  keyExtractor = (item: IncludedContact) => item.address
  render() {
    return (
      <FlatList
        data={this.props.contacts}
        keyExtractor={this.keyExtractor}
        extraData={this.props.selected}
        ListHeaderComponent={this.renderHeader()}
        ListFooterComponent={this.renderFooter()}
        renderItem={this.renderContact}
      />
    )
  }
}

export default ContactSelect
