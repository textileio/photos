import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { color, textStyle } from '../styles'

interface Props {
  title: string
  subtitle?: string
  leftItem?: JSX.Element
  rightItems?: JSX.Element[]
  onPress?: () => void
}

class ListItem extends React.PureComponent<Props> {

  public spliceRightItems = (items: JSX.Element[]) => {
    const foo: JSX.Element[] = []
    return foo.concat.apply([], items.map((item, index) => [<View key={index} style={{ width: 8 }} />, item]))
  }

  public render() {
    return (
      <TouchableOpacity delayPressIn={100} onPress={this.props.onPress}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12 }}>
          {this.props.leftItem &&
            this.props.leftItem
          }
          <View style={{ flex: 1, justifyContent: 'center', marginLeft: this.props.leftItem ? 12 : 0 }}>
            <Text style={{ ...textStyle.body_l, color: color.grey_2 }}>{this.props.title}</Text>
            {this.props.subtitle &&
              <Text style={{ ...textStyle.body_s, color: color.grey_4 }}>{this.props.subtitle}</Text>
            }
          </View>
          {this.props.rightItems &&
            this.spliceRightItems(this.props.rightItems)
          }
        </View>
      </TouchableOpacity>
    )
  }
}

export default ListItem
