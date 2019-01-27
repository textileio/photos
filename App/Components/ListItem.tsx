import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import * as s from '../Themes/Constants'

interface Props {
  id: string
  title: string
  subtitle?: string
  renderLeftItem?: () => JSX.Element
  renderRightItems?: () => JSX.Element[]
  onPress?: (id: string) => void
}

class ListItem extends React.PureComponent<Props> {

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.id)
    }
  }

  spliceRightItems = (items: JSX.Element[]) => {
    const foo: JSX.Element[] = []
    return foo.concat.apply([], items.map((item, index) => [<View key={index} style={{ width: 8 }} />, item]))
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 11, paddingBottom: 11 }}>
          {this.props.renderLeftItem &&
            this.props.renderLeftItem()
          }
          <View style={{ flex: 1, justifyContent: 'center', marginLeft: 11 }}>
            <Text style={{ fontFamily: s.FONT_FAMILY_REGULAR, fontSize: s.FONT_SIZE_MEDIUM, color: s.COLOR_FONT_DARK_ON_LIGHT_MEDIUM }}>{this.props.title}</Text>
            {this.props.subtitle &&
              <Text style={{ fontFamily: s.FONT_FAMILY_REGULAR, fontSize: s.FONT_SIZE_REGULAR, color: s.COLOR_FONT_DARK_ON_LIGHT_LIGHT }}>{this.props.subtitle}</Text>
            }
          </View>
          {this.props.renderRightItems &&
            this.spliceRightItems(this.props.renderRightItems())
          }
        </View>
      </TouchableOpacity>
    )
  }
}

export default ListItem
