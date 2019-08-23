import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native'
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
  disabled?: boolean
  titleStyle?: TextStyle
  invert?: boolean
}

class ListItem extends React.PureComponent<Props> {
  spliceItems = (items: JSX.Element[]) => {
    const spliced: JSX.Element[] = []
    return spliced.concat.apply(
      [],
      items.map((item, index) => {
        const spacer = <View key={index} style={{ width: spacing._008 }} />
        return items.length - 1 !== index
          ? [{ ...item, key: index + items.length }, spacer]
          : [{ ...item, key: index + items.length }]
      })
    )
  }

  render() {
    const checkbox = this.props.selecting
      ? [
          <Checkbox
            key="checkbox"
            checked={this.props.selected || false}
            uncheckedColor={color.grey_4}
            checkedColor={color.action_5}
          />
        ]
      : []
    const leftItem = this.props.leftItem ? [this.props.leftItem] : []

    const showDisclosure =
      (this.props.showDisclosure || false) && !(this.props.selecting || false)
    const disclosureIcon = showDisclosure
      ? [
          <Icon
            key="more"
            name="chevron-right"
            size={24}
            color={color.grey_4}
          />
        ]
      : []

    let leftItems = []
    let rightItems = []

    if (this.props.invert) {
      rightItems = [...checkbox]
      leftItems = [...(this.props.rightItems || []), ...disclosureIcon, ...leftItem]
    } else {
      leftItems = [...checkbox, ...leftItem]
      rightItems = [...(this.props.rightItems || []), ...disclosureIcon]
    }

    return (
      <TouchableOpacity
        delayPressIn={100}
        onPress={
          this.props.selecting ? this.props.onSelect : this.props.onPress
        }
        disabled={this.props.disabled}
      >
        <View
          style={{
            flex: 1,
            opacity: this.props.disabled ? 0.5 : 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: spacing._012,
            paddingRight: spacing._012,
            paddingTop: spacing._012,
            paddingBottom: spacing._012,
            ...this.props.style
          }}
        >
          {this.spliceItems(leftItems)}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginLeft: leftItems.length > 0 ? spacing._012 : 0,
              marginRight: rightItems.length > 0 ? spacing._012 : 0
            }}
          >
            <Text
              style={{
                ...textStyle.body_l,
                color: color.grey_2,
                ...this.props.titleStyle
              }}
            >
              {this.props.title}
            </Text>
            {this.props.subtitle && (
              <Text style={{ ...textStyle.body_s, color: color.grey_4 }}>
                {this.props.subtitle}
              </Text>
            )}
          </View>
          {this.spliceItems(rightItems)}
        </View>
      </TouchableOpacity>
    )
  }
}

export default ListItem
