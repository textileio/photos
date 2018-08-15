import React from 'react'
import { connect } from 'react-redux'
import { Switch, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import AuthAction from '../../../Redux/AuthRedux'
import PreferencesActions from '../../../Redux/PreferencesRedux'
import PermissionsInfo from '../../components/PermissionsInfo'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'
import SettingsRow from './SettingsRow'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import styles from './statics/styles'
import Avatar from '../../../Components/Avatar'
import { NavigationActions } from 'react-navigation'

class AccountSettings extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      complete: false,
      iOS: Platform.OS === 'ios',
      cameraRoll: false,
      locationBackground: false,
      infoVisible: false,
      info: { }
    }
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const greeting = params.username ? 'Hello ' + params.username : 'Hello'
    return {
      headerTitle: 'Settings',
      headerLeft: (
        <TextileHeaderButtons left>
          <TextileItem title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <HeaderButtons>
          <Item
            title='Avatar'
            buttonWrapperStyle={{marginLeft: 11, marginRight: 11}}
            ButtonElement={
              <Avatar
                width={32}
                height={32}
                uri={params.avatarUrl}
                defaultSource={require('../Settings/statics/main-image.png')}
              />
            }
          />
        </HeaderButtons>
      )
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      profile: this.props.profile
    })
  }

  toggleService (name) {
    let update = this.props.allServices[name]
    update.status = !update.status
    this.props.updateServicesRequest(name, update)
  }

  hideInfo () {
    this.setState({infoVisible: false})
  }

  getInfo (service) {
    switch (service) {
      case 'backgroundLocation':
        return {
          title: 'Always allow location',
          subtitle: 'Wakes app up for updates',
          details: 'Background location allows Textile to wake up periodically to check for updates to your camera roll and to check for updates on your peer-to-peer network. Without background location the app will never get any new information, it will be a pretty boring place. We never keep, store, process, or share your location data with anyone or any device.'
        }
      case 'notifications':
        return {
          title: 'Notifications',
          subtitle: 'Enables push notifications',
          details: 'Choose Textile events that trigger notifications. Notifications can be enabled or disabled at any time.'
        }
      case 'receivedInviteNotification':
        return {
          title: 'New Thread Invite',
          subtitle: 'Someone shares a photo with you'
        }
      case 'deviceAddedNotification':
        return {
          title: 'New Device Paired',
          subtitle: 'Someone shares a photo with you'
        }
      case 'photoAddedNotification':
        return {
          title: 'New Shared Photos',
          subtitle: 'Someone shares a photo with you'
        }
      // case 'commentAddedNotification':
      //   return {
      //     title: 'New Photo Comment',
      //     subtitle: 'Someone shares a photo with you'
      //   }
      // case 'likeAddedNotification':
      //   return {
      //     title: 'New Photo Like',
      //     subtitle: 'Someone shares a photo with you'
      //   }
      case 'peerJoinedNotification':
        return {
          title: 'Contact Joined Thread',
          subtitle: 'Someone shares a photo with you'
        }
      case 'peerLeftNotification':
        return {
          title: 'Contact Left Thread',
          subtitle: 'Someone shares a photo with you'
        }
      default:
        return {
          title: '',
          subtitle: '',
          info: ''
        }
    }
  }

  showInfo (service) {
    const info = this.getInfo(service)
    this.setState({infoVisible: true, info})
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Everything can run a bit better with a few permissions</Text>
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.listContainer}>
            {Object.keys(this.props.services)
              .filter((name) => this.getInfo(name).title !== '')
              .map((service, i) => {
                const value = !!this.props.services[service].status
                var children = Object.keys(this.props.children)
                  .filter((name) => this.getInfo(name).title !== '')
                  .filter((key) => this.props.children[key].dependsOn === service)
                  .reduce((previous, current) => {
                    previous[current] = this.props.children[current]
                    return previous
                  }, {})

                return (
                  <View key={i} >
                    <SettingsRow service={service} info={this.getInfo(service)} value={value} infoPress={this.showInfo.bind(this)} onChange={this.toggleService.bind(this)} />
                    {value && children && Object.keys(children).map((child, i) =>
                      <SettingsRow key={i * 33} child service={child} info={this.getInfo(child)} value={!!this.props.children[child].status} infoPress={this.showInfo.bind(this)} onChange={this.toggleService.bind(this)} />
                      )}
                  </View>
                  )
              }
            )}
          </View>
        </ScrollView>
        {this.state.infoVisible && <PermissionsInfo isVisible info={this.state.info} close={this.hideInfo.bind(this)} />}
      </View>
    )
  }
}

const mapStateToProps = state => {
  const allServices = state.preferences.services
  // get all top level services
  const services = Object.keys(allServices)
    .filter((key) => !allServices[key].dependsOn)
    .reduce((previous, current) => {
      previous[current] = allServices[current]
      return previous
    }, {})
  // get any services that depend on top level services
  const children = Object.keys(allServices)
    .filter((key) => !!allServices[key].dependsOn)
    .reduce((previous, current) => {
      previous[current] = allServices[current]
      return previous
    }, {})

  return {
    profile: state.preferences.profile,
    allServices,
    services,
    children
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateServicesRequest: (name, update) => { dispatch(PreferencesActions.updateServicesRequest(name, update)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings)
