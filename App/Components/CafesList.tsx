import React, { Component } from 'react'
import { FlatList } from 'react-native'
import Config from 'react-native-config'
import { Buffer } from 'buffer'

import CafeItem from './CafeItem'
import Separator from './Separator'

interface Cafe {
  name: string
  peerId: string
  token: string
}

interface Props {
  selected?: string
  onSelect: (peerId: string, token: string) => void
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
        data={filteredCafes}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={() => <Separator />}
        ListHeaderComponent={
          this.props.ListHeaderComponent
            ? this.props.ListHeaderComponent
            : undefined
        }
      />
    )
  }

  _keyExtractor = (item: Cafe) => item.peerId

  _renderItem = ({ item }: { item: Cafe }) => (
    <CafeItem
      name={item.name}
      peerId={item.peerId}
      token={item.token}
      disabled={this.props.disabled !== undefined ? this.props.disabled : false}
      selected={
        this.props.selected ? item.peerId === this.props.selected : false
      }
      onPressItem={this.props.onSelect}
    />
  )
}
