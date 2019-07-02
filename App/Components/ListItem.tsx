import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import Icon from '@textile/react-native-icon'

import Checkbox from '../Components/Checkbox'
import { color, textStyle, spacing } from '../styles'

interface Props {
  title: string
  subtitle?: string
  leftItem?: JSX.Element
  rightItems?: JSX.Element[]
  showDisclosure?: boolean
  selecting?: boolean
  selected?: boolean
  style?: ViewStyle
  onPress?: () => void
  onSelect?: () => void
}

class ListItem extends React.PureComponent<Props> {
  spliceRightItems = (items: JSX.Element[]) => {
    const spliced: JSX.Element[] = []
    return spliced.concat.apply(
      [],
      items.map((item, index) => [
        <View key={index} style={{ width: spacing._008 }} />,
        { ...item, key: index + items.length }
      ])
    )
  }

  spliceLeftItems = (items: JSX.Element[]) => {
    const spliced: JSX.Element[] = []
    return spliced.concat.apply(
      [],
      items.map((item, index) => [
        { ...item, key: index + items.length },
        <View key={index} style={{ width: spacing._008 }} />
      ])
    )
  }

  render() {
    const checkbox = this.props.selecting ? [(
      <Checkbox
        checked={this.props.selected || false}
        uncheckedColor={color.grey_3}
        checkedColor={color.action_5}
      />
    )] : []
    const leftItem = this.props.leftItem ? [this.props.leftItem] : []
    const leftItems = [
      ...checkbox,
      ...leftItem
    ]

    const showDisclosure = (this.props.showDisclosure || false) && !(this.props.selecting || false)
    const disclosureIcon = showDisclosure ? [(
      <Icon
        key="more"
        name="chevron-right"
        size={24}
        color={color.grey_4}
      />
    )] : []
    const rightItems = [
      ...this.props.rightItems || [],
      ...disclosureIcon
    ]

    return (
      <TouchableOpacity delayPressIn={100} onPress={this.props.selecting ? this.props.onSelect : this.props.onPress}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: spacing._012,
            paddingRight: spacing._012,
            paddingTop: spacing._012,
            paddingBottom: spacing._012,
            ...this.props.style
          }}
        >
          {this.spliceLeftItems(leftItems)}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginLeft: leftItems.length > 0 ? spacing._012 : 0
            }}
          >
            <Text style={{ ...textStyle.body_l, color: color.grey_2 }}>
              {this.props.title}
            </Text>
            {this.props.subtitle && (
              <Text style={{ ...textStyle.body_s, color: color.grey_4 }}>
                {this.props.subtitle}
              </Text>
            )}
          </View>
          {this.spliceRightItems(rightItems)}
        </View>
      </TouchableOpacity>
    )
  }
}

export default ListItem
