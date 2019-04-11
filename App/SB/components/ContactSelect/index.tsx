import React, { Fragment } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, ListRenderItemInfo } from 'react-native'
import Avatar from '../../../Components/Avatar'

import ContactSelectCard, {ContactLinkCard} from './ContactSelectCard'

import styles from './statics/styles'
import { pb } from '@textile/react-native-sdk'

function getSubTitle(contacts: IncludedContact[], topFive: IncludedContact[], notInThread: boolean) {
  if (contacts.length === 0) {
    return 'You don\'t have any contacts.'
  } else if (topFive.length > 0 && topFive.length > 0 && notInThread) {
    return 'Suggested:'
  }
  return 'Invite existing contacts or generate an external invite link or QR code.'
}

export interface IncludedContact extends pb.IContact {
  type: string
  included: boolean
}

interface ContactSelectComponentProps {
  getPublicLink: () => void
  displayQRCode: () => void
  select: (item: IncludedContact, included: boolean) => void
  selected: {[key: string]: boolean}
  contacts: IncludedContact[]
}

interface ContactSelectProps extends ContactSelectComponentProps {
  threadName: string
  notInThread: boolean
  topFive: IncludedContact[]
}

// puts a placeholder row in contacts for adding external invite link
const ContactSelect = (props: ContactSelectProps) => {
  const { getPublicLink, displayQRCode, contacts, select, selected, topFive, notInThread, threadName } = props
  const subTitle = getSubTitle(contacts, topFive, notInThread)
  const showSuggested = topFive.length > 0 && notInThread

  const title = threadName && threadName !== '' ? `Invite to ${threadName}` : 'Invite others'

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

        {showSuggested && <View style={styles.selectedContactList}>
          {topFive.map((item) => {
            // const item = contacts.find(c => c.id === id)
            if (!item) {
              return (<View />)
            }

            const selectState = !!selected[item.address] || item.included

            return (
              <TouchableOpacity key={item.address} activeOpacity={0.6} style={styles.selectedContact} onPress={onPress(item)}>
                <Avatar style={styles.selectedContact} target={item.avatar} />
                {selectState && <Image style={styles.selectedContactIcon} source={require('./statics/icon-select.png')} />}
              </TouchableOpacity>
            )
          })}
        </View>}
      </View>
      <View style={styles.body}>
        <View style={styles.searchBoxPlaceholder} />
        <ContactSelectComponent
          contacts={contacts}
          selected={selected}
          select={select}
          getPublicLink={getPublicLink}
          displayQRCode={displayQRCode}
        />
      </View>
    </View>
  )
}

export class ContactSelectComponent extends React.Component<ContactSelectComponentProps> {
  renderHeader = () => {
    return (
      <Fragment>
        <ContactLinkCard
          icon={'external-link'}
          text={'Share invite by link'}
          select={this.props.getPublicLink}
        />
        <ContactLinkCard
          icon={'qr-code'}
          text={'Display QR code invite'}
          select={this.props.displayQRCode}
        />
      </Fragment>
    )
  }

  renderRow = (contact: ListRenderItemInfo<IncludedContact>) => {
    const { item } = contact
    const selectState = !!this.props.selected[item.address] || item.included
    return (
      <ContactSelectCard item={item} select={this.props.select} selected={selectState} />
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
        renderItem={this.renderRow}
      />
    )
  }
}

export default ContactSelect
