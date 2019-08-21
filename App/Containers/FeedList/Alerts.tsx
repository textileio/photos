import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootAction } from '../../Redux/Types'
import {
  View,
  Text,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native'
import { updatesActions } from '../../features/updates'
import { LocalAlert, LocalAlertType } from '../../features/updates/models'
import { color, size, textStyle } from '../../styles'

const alertImages = {
  '../../Images/v2/invite_a_bot.png': require('../../Images/v2/invite_a_bot.png'),
  '../../Images/v2/upgrade_alert.png': require('../../Images/v2/upgrade_alert.png')
}

const ALERT_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  paddingVertical: size._016,
  borderBottomColor: color.grey_4,
  borderBottomWidth: StyleSheet.hairlineWidth
}
const ALERT_CONTENT: ViewStyle = {
  flex: 1,
  paddingHorizontal: size._016
}
const ALERT_BLURB: TextStyle = {
  ...textStyle.body_m,
  textAlign: 'justify',
  color: color.grey_2
}

interface ScreenProps {
  alerts: LocalAlert[]
}

interface DispatchProps {
  routeAlertEngagement: (type: LocalAlertType) => void
}

type Props = ScreenProps & DispatchProps

interface State {
  selected?: LocalAlertType
}

class Alerts extends React.Component<Props, State> {
  state: State = {}
  _keyExtractor = (item: LocalAlert, index: number) => index.toString()

  toggle = (type: LocalAlertType) => {
    return () => {
      if (this.state.selected === type) {
        this.setState({ selected: undefined })
      } else {
        this.setState({ selected: type })
      }
    }
  }

  renderBullet = (limit: string, key: number) => {
    return (
      <Text
        key={key}
        style={{
          ...textStyle.body_s,
          color: color.grey_3,
          paddingVertical: 4
        }}
      >
        - {limit}
      </Text>
    )
  }

  renderAlertCategory = (text: string) => {
    return (
      <Text style={{ ...textStyle.body_s, color: color.action_3 }}>
        {text.toUpperCase()}
      </Text>
    )
  }
  renderAlertTitle = (text: string) => {
    return (
      <Text style={{ ...textStyle.header_m, marginVertical: 6 }}>{text}</Text>
    )
  }
  renderAlertDescription = (text: string) => {
    const clickableText = ' >'
    return (
      <Text style={ALERT_BLURB}>
        {text}
        <Text
          style={{
            color: color.brandBlue,
            marginLeft: 6
          }}
        >
          {clickableText}
        </Text>
      </Text>
    )
  }
  renderAlertImage = (path: string) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignContent: 'flex-start',
          justifyContent: 'flex-start',
          padding: size._016
        }}
      >
        <Image
          style={{
            width: '100%',
            aspectRatio: 3 / 2,
            borderRadius: 2,
            borderColor: color.grey_3,
            borderWidth: StyleSheet.hairlineWidth
          }}
          resizeMode={'cover'}
          // @ts-ignore
          source={alertImages[path]}
        />
      </View>
    )
  }

  touchAlert = (type: LocalAlertType) => {
    return () => {
      this.props.routeAlertEngagement(type)
    }
  }

  botTemplate = (
    type: LocalAlertType,
    linkText: string,
    title: string,
    short: string,
    long: string,
    capabilities: string[],
    limits: string[],
    image: string
  ) => {
    const selected = this.state.selected === type
    const description = selected ? long : short

    const botLimits = limits.map(this.renderBullet)

    const botCapabilities = capabilities.map(this.renderBullet)

    const toggle = selected ? 'Bots can:' : 'Read more'
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={ALERT_CONTAINER}
        onPress={this.touchAlert(type)}
      >
        <View style={ALERT_CONTENT}>
          {this.renderAlertCategory(linkText)}
          {this.renderAlertTitle(title)}
          {this.renderAlertDescription(description)}
          <TouchableOpacity onPress={this.toggle(type)}>
            <Text
              style={{
                ...textStyle.body_s,
                paddingTop: 10,
                paddingRight: 30,
                color: color.grey_2
              }}
            >
              {toggle}
            </Text>
          </TouchableOpacity>
          {selected && (
            <View>
              <View style={{ paddingTop: 10 }}>{botCapabilities}</View>
              <Text
                style={{
                  ...textStyle.body_s,
                  paddingTop: 10,
                  paddingRight: 30,
                  color: color.grey_2
                }}
              >
                Bots cannot:
              </Text>
              <View style={{ paddingTop: 10 }}>{botLimits}</View>
            </View>
          )}
        </View>
        {this.renderAlertImage(image)}
      </TouchableOpacity>
    )
  }

  upgradeTemplate = (
    type: LocalAlertType,
    linkText: string,
    title: string,
    short: string,
    image: string
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={ALERT_CONTAINER}
        onPress={this.touchAlert(type)}
      >
        <View style={ALERT_CONTENT}>
          {this.renderAlertCategory(linkText)}
          {this.renderAlertTitle(title)}
          {this.renderAlertDescription(short)}
        </View>
        {this.renderAlertImage(image)}
      </TouchableOpacity>
    )
  }
  renderAlert = (alert: LocalAlert) => {
    switch (alert.type) {
      case LocalAlertType.NoStorageBot: {
        return this.botTemplate(
          alert.type,
          'Required',
          'Enable Your Storage Bot',
          'Storage bots backup encrypted photos and messages',
          'Storage bots backup encrypted versions of your groups to ensure you never lose your photos. They also deliver messages to you that you miss when your phone is offline',
          [
            'Remotely store your backups',
            'Help sync your devices',
            'Deliver your missed messages'
          ],
          [
            'See your photos',
            'Read your messages',
            'Decrypt your data',
            'Share your data'
          ],
          '../../Images/v2/invite_a_bot.png'
        )
      }
      case LocalAlertType.UpgradeNeeded: {
        return this.upgradeTemplate(
          alert.type,
          'Important',
          'Upgrade Textile Photos',
          'Uh oh! Your app is out of date. Upgrade now to enjoy the latest and greatest version of Textile Photos',
          '../../Images/v2/upgrade_alert.png'
        )
      }
    }
  }
  render() {
    if (this.props.alerts.length < 1) {
      return
    }
    return this.renderAlert(this.props.alerts[0])
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  routeAlertEngagement: (type: LocalAlertType) =>
    dispatch(updatesActions.routeAlertEngagement(type))
})

export default connect(
  undefined,
  mapDispatchToProps
)(Alerts)
