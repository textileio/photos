import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Platform } from 'react-native'
import PreferencesActions from '../../../Redux/PreferencesRedux'
import PermissionsInfo from '../../components/PermissionsInfo'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'
import SettingsRow from '../../components/SettingsRow'
import GetServiceInfo from './GetServiceInfo'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import styles from './statics/styles'
import Avatar from '../../../Components/Avatar'
import { NavigationActions } from 'react-navigation'

class Notifications extends React.PureComponent {
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
    return {
      headerTitle: 'Notifications',
      headerLeft: (
        <TextileHeaderButtons left>
          <TextileItem title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <HeaderButtons>
          <Item
            title='Avatar'
            buttonWrapperStyle={{ marginLeft: 11, marginRight: 11 }}
            ButtonElement={
              <Avatar
                width={32}
                height={32}
                defaultSource={require('./statics/main-image.png')}
                owner
              />
            }
          />
        </HeaderButtons>
      )
    }
  }

  toggleService (name) {
    if (name === 'notifications') {
      // never prompt the user later to get those
      this.props.completeScreen(name)
    }
    this.props.toggleServicesRequest(name)
  }

  hideInfo () {
    this.setState({ infoVisible: false })
  }

  showInfo (service) {
    const info = GetServiceInfo(service)
    this.setState({ infoVisible: true, info })
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose the types of notifications you want to receive.</Text>
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.listContainer}>
            {Object.keys(this.props.services)
              .map((service, i) => {
                const value = !!this.props.services[service].status
                let children = Object.keys(this.props.children)
                  .filter((key) => this.props.children[key].info.dependsOn === service)
                  .reduce((previous, current) => {
                    previous[current] = this.props.children[current]
                    return previous
                  }, {})

                return (
                  <View key={i} >
                    <SettingsRow service={service} info={this.props.services[service].info} value={value} infoPress={this.showInfo.bind(this)} onChange={this.toggleService.bind(this)} />
                    {children && Object.keys(children).map((child, i) =>
                      <SettingsRow
                        key={i * 33}
                        child
                        service={child}
                        info={this.props.children[child].info}
                        disabled={!value}
                        value={!!this.props.children[child].status}
                        infoPress={this.showInfo.bind(this)}
                        onChange={this.toggleService.bind(this)}
                      />
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
  // get all top level services
  const allServices = Object.keys(state.preferences.services)
    .reduce((previous, current) => {
      let basic = state.preferences.services[current]
      basic.info = GetServiceInfo(current)
      previous[current] = basic
      return previous
    }, {})

  const services = Object.keys(allServices)
    .filter((key) => allServices[key].info !== undefined && allServices[key].info.dependsOn === undefined)
    .reduce((previous, current) => {
      previous[current] = allServices[current]
      return previous
    }, {})

  // get any services that depend on top level services
  const children = Object.keys(allServices)
    .filter((key) => allServices[key].info !== undefined && allServices[key].info.dependsOn !== undefined)
    .reduce((previous, current) => {
      previous[current] = allServices[current]
      return previous
    }, {})

  return {
    allServices,
    services,
    children
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleServicesRequest: (name) => { dispatch(PreferencesActions.toggleServicesRequest(name)) },
    completeScreen: (name) => { dispatch(PreferencesActions.completeTourSuccess(name)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
