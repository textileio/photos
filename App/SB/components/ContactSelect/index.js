import React from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import Avatar from '../../../Components/Avatar'
import Config from 'react-native-config'

import RadioButton from '../../components/RadioButton'

import styles from './statics/styles'

const ContactSelect = (props) => {
  const { getPublicLink, contacts, select, selected, threadId, topFive } = props
  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Add peers</Text>
          <TouchableOpacity onPress={getPublicLink}>
            <Text style={[styles.link, styles.small]}>invite new users</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Suggested peers</Text>
        <View style={styles.selectedContactList}>
          {topFive.map((id) => {

            const item = contacts.find(c => c.id === id)
            if (!item) return (<View />)

            const defaultSource = require('../../../Images/v2/main-image.png')
            let uri = item.id ? Config.TEXTILE_CAFE_URI + '/ipns/' + item.id + '/avatar' : undefined

            const included = item.thread_ids.includes(threadId)
            const selectState = !!selected[item.id] || included

            return (
              <TouchableOpacity key={id} style={styles.selectedContact} onPress={() => {
                select(item, included)
              }}>
                <Avatar style={styles.selectedContact} width={43} height={43} uri={uri} defaultSource={defaultSource} />
                {selectState && <Image style={styles.selectedContactIcon} source={require('./statics/icon-select.png')} />}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <View style={styles.body}>
        {/*<View style={styles.searchBoxContainer}>*/}
          {/*<Image style={styles.searchBoxIcon} source={require('./statics/icon-search.png')} />*/}
          {/*<TextInput style={styles.searchBoxInput} placeholder='Search' onChangeText={search} />*/}
        {/*</View>*/}
        <View style={styles.searchBoxPlaceholder} />

        <FlatList
          data={contacts}
          keyExtractor={(item, index) => item.pk}
          extraData={selected}
          renderItem={(contact) => {
            const {item} = contact
            const defaultSource = require('../../../Images/v2/main-image.png')
            let uri = item.id ? Config.TEXTILE_CAFE_URI + '/ipns/' + item.id + '/avatar' : undefined

            const included = item.thread_ids.includes(threadId)
            const selectState = !!selected[item.id] || included
            return (
              <TouchableOpacity style={styles.contactItem} onPress={() => {
                select(item, included)
              }}>
                <Avatar style={styles.selectedContact} width={43} height={43} uri={uri} defaultSource={defaultSource} />
                <Text style={styles.contactName}>{item.username || 'peer'}</Text>
                <View style={styles.contactSelectRadio}>
                  <RadioButton disabled={included} selected={selectState} />
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

export default ContactSelect
