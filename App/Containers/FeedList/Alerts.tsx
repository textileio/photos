import React from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { LocalAlert } from '../../features/updates/models'
import { color, size, textStyle } from '../../styles'

const alertImages = {
  '../../Images/v2/invite_a_bot.png': require('../../Images/v2/invite_a_bot.png')
}
interface ScreenProps {
  alerts: LocalAlert[]
  registerCafe: () => void
}

interface State {
  selected?: string
}

export default class Alerts extends React.Component<ScreenProps, State> {
  state: State = {}
  _keyExtractor = (item: LocalAlert, index: number) => index.toString()

  toggle = (type: string) => {
    return () => {
      if (this.state.selected === type) {
        this.setState({selected: undefined})
      } else {
        this.setState({selected: type})
      }
    }
  }
  itemTemplate = (
    type: string,
    linkText: string,
    title: string,
    short: string,
    long: string,
    limits: string[],
    image: string,
    linkCallback: () => void
  ) => {

    const selected = this.state.selected === type
    const description = selected ? long : short 

    const more = limits.map((limit) => {
      return (<Text style={{...textStyle.body_s, color: color.grey_3, paddingVertical: 4}} >{limit}</Text>)
    })

    const toggle = selected ? 'Bots cannot:' : 'Learn more'
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingVertical: size._016
        }}
        onPress={linkCallback}
      >
        <View style={{
          flex: 1,
          paddingHorizontal: size._016
        }}>
          <Text style={{...textStyle.body_s, color: color.action_3}} >{linkText.toUpperCase()}</Text>
          <Text style={{...textStyle.header_m, marginVertical: 6}} >{title}</Text>
          <Text style={{...textStyle.body_m, textAlign: 'justify', color: color.grey_2}} >{description}</Text>
          <TouchableOpacity
            onPress={this.toggle(type)}
          >
            <Text style={{...textStyle.body_s, paddingTop: 10, paddingRight: 30, color: color.grey_2}} >{toggle}</Text>
          </TouchableOpacity>
          {selected &&
            <View
              style={{paddingTop: 10}}
            >
              {more}
              <Text style={{...textStyle.body_s, paddingTop: 10, color: color.grey_2}} >Choose one now</Text>
            </View>
          }
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignSelf: 'stretch',
          padding: size._016,
        }}>
          <Image 
            style={{
              flex: 1,
              borderRadius: 2,
              borderColor: color.grey_3,
              borderWidth: StyleSheet.hairlineWidth
            }}
            resizeMode='cover'
            // @ts-ignore
            source={alertImages[image]} 
          />
        </View>
      </TouchableOpacity>
    )
  }
  renderItem = ({ item }: ListRenderItemInfo<LocalAlert>) => {
    if (item.type === 'no-storage-bot') {
      return this.itemTemplate(
        item.type,
        'Upgrade',
        'Enable Your Storage Bot',
        'Storage bots backup encrypted photos and messages.',
        'Storage bots backup encrypted versions of your groups to ensure you never lose your photos. They also deliver messages to you that you miss when your phone is offline.',
        [
          'See your photos',
          'Read your messages',
          'Decrypt your data',
          'Share your data'
        ],
        '../../Images/v2/invite_a_bot.png',
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
        style={{
          borderBottomColor: color.grey_4,
          borderBottomWidth: StyleSheet.hairlineWidth
        }}
      />
    )
  }
}
