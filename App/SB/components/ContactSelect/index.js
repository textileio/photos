import React from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import Avatar from '../../../Components/Avatar'
import ImageSc from 'react-native-scalable-image'

import ContactSelectCard from './ContactSelectCard'

import styles from './statics/styles'

function getSubTitle (contacts, topFive, notInThread): string {
  if (contacts.length === 0) {
    return 'No peers yet'
  } else if (contacts.length > 0 && notInThread === 0) {
    return 'No peers left to invite'
  } else if (topFive.length > 0 && topFive.length > notInThread) {
    return 'Suggested peers'
  }
  return 'Press invite when done'
}

const ContactSelect = (props) => {
  const { getPublicLink, contacts, select, selected, topFive, notInThread } = props
  const subTitle = getSubTitle(contacts, topFive, notInThread)
  const showSuggested = topFive.length > 0 && topFive.length > notInThread
  const anySelected = Object.keys(selected).find(k => selected[k] === true)
  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Select new peers</Text>
        </View>

        {subTitle && <Text style={styles.subtitle}> { subTitle } </Text> }

        {showSuggested && <View style={styles.selectedContactList}>
          {topFive.map((item) => {
            // const item = contacts.find(c => c.id === id)
            if (!item) return (<View />)

            const defaultSource = require('../../../Images/v2/main-image.png')

            const selectState = !!selected[item.id] || item.included

            return (
              <TouchableOpacity key={item.id} activeOpacity={0.6} style={styles.selectedContact} onPress={() => {
                select(item, item.included)
              }}>
                <Avatar style={styles.selectedContact} width={43} height={43} peer_id={item.id} defaultSource={defaultSource} />
                {selectState && <Image style={styles.selectedContactIcon} source={require('./statics/icon-select.png')} />}
              </TouchableOpacity>
            )
          })}
        </View>}
      </View>
      <View style={styles.body}>
        {/*<View style={styles.searchBoxContainer}>*/}
          {/*<Image style={styles.searchBoxIcon} source={require('./statics/icon-search.png')} />*/}
          {/*<TextInput style={styles.searchBoxInput} placeholder='Search' onChangeText={search} />*/}
        {/*</View>*/}
        <View style={styles.searchBoxPlaceholder} />

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.pk}
          extraData={selected}
          renderItem={(contact) => {
            const {item} = contact
            const selectState = !!selected[item.id] || item.included
            return (
              <ContactSelectCard item={item} select={select} selected={selectState} />
            )
          }}
        />
        <TouchableOpacity activeOpacity={0.4} style={styles.inviteItem} onPress={getPublicLink}>
          <ImageSc
            source={require('../../../Images/v2/send.png')}
            width={20}
            height={20}
            resizeMode={'cover'}
            style={!!anySelected && styles.inviteLessImage}
          />
          <Text style={[styles.inviteLink, !!anySelected && styles.inviteLess]}>Invite a new user</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ContactSelect
