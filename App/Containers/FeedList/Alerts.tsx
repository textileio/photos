import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  NavigationScreenProps,
  NavigationEventSubscription
} from 'react-navigation'
import Buttons from 'react-navigation-header-buttons'

import Avatar from '../../Components/Avatar'
import FeedItem from '../../SB/components/FeedItem'
import { TextileHeaderButtons } from '../../Components/HeaderButtons'

import PreferencesActions from '../../Redux/PreferencesRedux'
import TextileEventsActions from '../../Redux/TextileEventsRedux'

import * as selectors from '../../features/updates/selectors'
import * as actions from '../../features/updates/actions'

import { RootAction, RootState } from '../../Redux/Types'

import { Notification, LocalAlert } from '../../features/updates/models'

import styles from './statics/styles'
import onboardingStyles from '../Styles/OnboardingStyle'
import AlertRow from '../../SB/components/AlertRow'
import { color, size, textStyle } from '../../styles'

interface ScreenProps {
  alerts: LocalAlert[]
  registerCafe: () => void
}

export default class Alerts extends React.Component<ScreenProps> {
  _keyExtractor = (item: LocalAlert, index: number) => index.toString()
  itemTemplate = (title: string, description: string, linkText: string, linkCallback: () => void) => {

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: color.accent2_6,
          borderBottomColor: color.grey_3,
          borderBottomWidth: StyleSheet.hairlineWidth
        }}
        onPress={linkCallback}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignSelf: 'stretch',
        }}>
          <Image 
            style={{
              flex: 1
            }}
            resizeMode='cover'
            source={require('../../Images/v2/invite_a_bot.png')} 
          />
        </View>
        <View style={{
          flex: 1,
          padding: size._012
        }}>
          <Text style={{...textStyle.header_m, marginVertical: 6}} >{title}</Text>
          <Text style={{...textStyle.body_m, textAlign: 'justify', marginVertical: 3}} >{description}</Text>
          <Text style={{...textStyle.body_m, marginVertical: 6, color: color.action_3}} >{linkText}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  renderItem = ({ item }: ListRenderItemInfo<LocalAlert>) => {
    if (item.type === 'no-storage-bot') {
      return this.itemTemplate(
        'Connect your storage bot',
        'Storage bots can host a remote backup of your groups to ensure you never lose your photos. They can also ensure you never miss a shared photo when your phone is offline.',
        'Connect now',
        this.props.registerCafe
      )
    }
  }
  render() {
    return (
      <FlatList
        data={this.props.alerts}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        refreshing={false}
      />
    )
  }
}
