import React, { Component } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import Config from 'react-native-config'
import { Buffer } from 'buffer'

import ListItem from './ListItem'
import RowSeparator from './RowSeparator'
import ActionText from './action-text'
import { size } from '../styles';

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
  onAddCustom?: () => void
}

const cafesBase64 = Config.RN_TEXTILE_CAFES_JSON
const cafesString = new Buffer(cafesBase64, 'base64').toString()
const cafes: Cafe[] = JSON.parse(cafesString)

interface CafeItem {
  type: 'cafe'
  cafe: Cafe
}

interface AddCustomItem {
  type: 'addCustom'
}

type Item = CafeItem | AddCustomItem

export default class CafesList extends Component<Props> {
  render() {
    // Filter cafes as not to include those the user is already registered with
    // not used during onboarding
    const filteredCafes: CafeItem[] = cafes
      .filter(cafe => {
        if (this.props.alreadyRegistered) {
          if (this.props.alreadyRegistered.indexOf(cafe.peerId) !== -1) {
            return false
          }
        }
        return true
      })
      .map(cafe => ({ type: 'cafe', cafe }))
    const data: Item[] = [...filteredCafes, { type: 'addCustom' }]
    return (
      <FlatList
        style={{ flex: 1 }}
        data={data}
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

  _keyExtractor = (item: Item) => {
    switch (item.type) {
      case 'cafe':
        return item.cafe.peerId
      case 'addCustom':
        return 'addCustom'
    }
  }

  _renderItem = ({ item }: { item: Item }) => {
    switch (item.type) {
      case 'cafe':
          return (
            <ListItem
              title={item.cafe.name}
              subtitle={item.cafe.peerId}
              selecting={true}
              selected={item.cafe.peerId === this.props.selected}
              onSelect={this.props.onSelect(item.cafe.peerId, item.cafe.token)}
              disabled={this.props.disabled}
            />
          )
      case 'addCustom':
        return (
          <TouchableOpacity style={{ alignItems: 'center', padding: size._024 }} onPress={this.props.onAddCustom} disabled={this.props.disabled}>
            <ActionText text='ADD A CUSTOM CAFE' iconName='pencil-create' />
          </TouchableOpacity>
        )
    }
  }
}
