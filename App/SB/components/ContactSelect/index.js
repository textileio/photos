import React, { Fragment } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import Avatar from '../../../Components/Avatar'

import ContactSelectCard, {ContactLinkCard} from './ContactSelectCard'

import styles from './statics/styles'

function getSubTitle (contacts, topFive, notInThread) {
  if (contacts.length === 0) {
    return 'You don\'t have any contacts.'
  } else if (topFive.length > 0 && topFive.length > notInThread) {
    return 'Suggested:'
  }
  return 'Invite existing contacts or generate an external invite link or QR code.'
}

const ContactSelect = (props) => {
  const { getPublicLink, displayQRCode, contacts, select, selected, topFive, notInThread, threadName } = props
  const subTitle = getSubTitle(contacts, topFive, notInThread)
  const showSuggested = topFive.length > 0 && topFive.length > notInThread

  const title = threadName && threadName !== '' ? `Invite to ${threadName}` : 'Invite others'
  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {subTitle && <Text style={styles.subtitle}>{subTitle}</Text> }

        {showSuggested && <View style={styles.selectedContactList}>
          {topFive.map((item) => {
            // const item = contacts.find(c => c.id === id)
            if (!item) {
              return (<View />)
            }

            const selectState = !!selected[item.address] || item.included

            return (
              <TouchableOpacity key={item.address} activeOpacity={0.6} style={styles.selectedContact} onPress={() => {
                select(item, item.included)
              }}>
                <Avatar style={styles.selectedContact} target={item.avatar} />
                {selectState && <Image style={styles.selectedContactIcon} source={require('./statics/icon-select.png')} />}
              </TouchableOpacity>
            )
          })}
        </View>}
      </View>
      <View style={styles.body}>
        {/* <View style={styles.searchBoxContainer}> */}
        {/* <Image style={styles.searchBoxIcon} source={require('./statics/icon-search.png')} /> */}
        {/* <TextInput style={styles.searchBoxInput} placeholder='Search' onChangeText={search} /> */}
        {/* </View> */}
        <View style={styles.searchBoxPlaceholder} />
        <ContactSelectComponent
          contacts={contacts}
          selected={selected}
          onSelect={select}
          selected={selected}
          getPublicLink={getPublicLink}
          displayQRCode={displayQRCode}
        />
      </View>
    </View>
  )
}

export class ContactSelectComponent extends React.Component {
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
  render () {
    return (
      <FlatList
      data={this.props.contacts}
      keyExtractor={(item) => item.address}
      extraData={this.props.selected}
      ListHeaderComponent={this.renderHeader()}
      renderItem={(contact) => {
        const { item } = contact
        const selectState = !!this.props.selected[item.address] || item.included
        return (
          <ContactSelectCard item={item} select={this.props.onSelect} selected={selectState} />
        )
      }}
    />
    )
  }
}

export default ContactSelect
