import React, { Component } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'

import { Cafe, cafes } from '../Models/cafes'
import ListItem from './ListItem'
import RowSeparator from './RowSeparator'
import ActionText from './action-text'
import { size } from '../styles'

interface Props {
  selected?: string
  onSelect: (peerId: string, token: string) => () => void
  alreadyRegistered?: ReadonlyArray<string>
  ListHeaderComponent?: JSX.Element
  disabled?: boolean
  onAddCustom?: () => void
}

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
      .map(
        (cafe): CafeItem => {
          return { type: 'cafe', cafe }
        }
      )
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
          <TouchableOpacity
            style={{ alignItems: 'center', padding: size._024 }}
            onPress={this.props.onAddCustom}
            disabled={this.props.disabled}
          >
            <ActionText text="ENTER CUSTOM CAFE" iconName="pencil-create" />
          </TouchableOpacity>
        )
    }
  }
}
