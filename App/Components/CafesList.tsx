import React, { Component } from 'react'
import { FlatList } from 'react-native'
import Config from 'react-native-config'
import { Buffer } from 'buffer'

import ListItem from './ListItem'
import RowSeparator from './RowSeparator'

interface Cafe {
  name: string
  peerId: string
  token: string
}

interface Props {
  selected?: string
  onSelect: (peerId: string, token: string) => () => void
  alreadyRegistered?: ReadonlyArray<string>
  ListHeaderComponent?: JSX.Element
  disabled?: boolean
}

const cafesBase64 = Config.RN_TEXTILE_CAFES_JSON
const cafesString = new Buffer(cafesBase64, 'base64').toString()
const cafes: Cafe[] = JSON.parse(cafesString)

export default class CafesList extends Component<Props> {
  render() {
    // Filter cafes as not to include those the user is already registered with
    // not used during onboarding
    const filteredCafes = cafes.filter(cafe => {
      if (this.props.alreadyRegistered) {
        if (this.props.alreadyRegistered.indexOf(cafe.peerId) !== -1) {
          return false
        }
      }
      return true
    })
    return (
      <FlatList
        style={{ flex: 1 }}
        data={filteredCafes}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={RowSeparator}
        ListHeaderComponent={
          this.props.ListHeaderComponent
            ? this.props.ListHeaderComponent
            : undefined
        }
      />
    )
  }

  _keyExtractor = (item: Cafe) => item.peerId

  _renderItem = ({ item }: { item: Cafe }) => {
    return (
      <ListItem
        title={item.name}
        subtitle={item.peerId}
        selecting={true}
        selected={item.peerId === this.props.selected}
        onSelect={this.props.onSelect(item.peerId, item.token)}
        disabled={this.props.disabled}
      />
    )
  }
}
