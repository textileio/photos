import React from 'react'
import { View, Text, Image, FlatList, TextInput, TouchableOpacity } from 'react-native'
import Avatar from '../../../Components/Avatar'
import Config from 'react-native-config'

import RadioButton from '../../components/RadioButton'

import styles from './statics/styles'

const ContactSelect = (props) => {
  const { getPublicLink, contacts, select, selected, threadId } = props
  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Add contacts</Text>
          <TouchableOpacity onPress={getPublicLink}>
            <Text style={[styles.link, styles.small]}>Get link</Text>
          </TouchableOpacity>
        </View>
        {/*<Text style={styles.subtitle}>Suggestion contacts</Text>*/}
        {/*<View style={styles.selectedContactList}>*/}
          {/*<View style={styles.selectedContact}>*/}
            {/*<Image style={styles.contactIcon} source={require('./statics/icon-photo1.png')} />*/}
            {/*<Image style={styles.selectedContactIcon} source={require('./statics/icon-select.png')} />*/}
          {/*</View>*/}
          {/*<View style={styles.selectedContact}>*/}
            {/*<Image style={styles.contactIcon} source={require('./statics/icon-photo1.png')} />*/}
          {/*</View>*/}
          {/*<View style={styles.selectedContact}>*/}
            {/*<Image style={styles.contactIcon} source={require('./statics/icon-photo1.png')} />*/}
          {/*</View>*/}
          {/*<View style={styles.selectedContact}>*/}
            {/*<Image style={styles.contactIcon} source={require('./statics/icon-photo1.png')} />*/}
          {/*</View>*/}
        {/*</View>*/}
      </View>
      <View style={styles.body}>
        {/*<View style={styles.searchBoxContainer}>*/}
          {/*<Image style={styles.searchBoxIcon} source={require('./statics/icon-search.png')} />*/}
          {/*<TextInput style={styles.searchBoxInput} placeholder='Search' onChangeText={search} />*/}
        {/*</View>*/}

        <FlatList
          data={contacts}
          keyExtractor={(item, index) => item.id}
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
                {/*<Image style={styles.selectedContact} source={require('./statics/icon-photo1.png')} />*/}
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
