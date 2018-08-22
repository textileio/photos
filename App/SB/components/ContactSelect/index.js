import React from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import Avatar from '../../../Components/Avatar'

import RadioButton from '../../components/RadioButton'

import styles from './statics/styles'

const ContactSelect = (props) => {
  const { getPublicLink, contacts, select, selected, topFive } = props
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
        {topFive.length > 0 && <View style={styles.selectedContactList}>
          {topFive.map((item) => {
            console.log('item', item)
            // const item = contacts.find(c => c.id === id)
            if (!item) return (<View />)

            const defaultSource = require('../../../Images/v2/main-image.png')

            const selectState = !!selected[item.id] || item.included

            return (
              <TouchableOpacity key={item.id} style={styles.selectedContact} onPress={() => {
                select(item, item.included)
              }}>
                <Avatar style={styles.selectedContact} width={43} height={43} uri={item.uri} defaultSource={defaultSource} />
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
        {topFive.length > 0 &&<View style={styles.searchBoxPlaceholder} />}

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.pk}
          extraData={selected}
          renderItem={(contact) => {
            const {item} = contact
            const defaultSource = require('../../../Images/v2/main-image.png')

            const selectState = !!selected[item.id] || item.included
            return (
              <TouchableOpacity style={styles.contactItem} onPress={() => {
                select(item, item.included)
              }}>
                <Avatar style={styles.selectedContact} width={43} height={43} uri={item.uri} defaultSource={defaultSource} />
                <Text style={styles.contactName}>{item.username || 'peer'}</Text>
                <View style={styles.contactSelectRadio}>
                  <RadioButton disabled={item.included} selected={selectState} />
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
