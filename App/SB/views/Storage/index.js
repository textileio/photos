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

class Storage extends React.PureComponent {
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
      headerTitle: 'Storage',
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

  toggleOption (name) {
    this.props.toggleStorageRequest(name)
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
          <Text style={styles.title}>Choose your photo storage options.</Text>
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.listContainer}>
            {Object.keys(this.props.mainOptions)
              .map((option, i) => {
                const value = !!this.props.mainOptions[option].status
                let children = Object.keys(this.props.children)
                  .filter((key) => this.props.children[key].info.dependsOn === option)
                  .reduce((previous, current) => {
                    previous[current] = this.props.children[current]
                    return previous
                  }, {})

                return (
                  <View key={i} >
                    <SettingsRow service={option} info={this.props.mainOptions[option].info} value={value} infoPress={this.showInfo.bind(this)} onChange={this.toggleOption.bind(this)} />
                    {children && Object.keys(children).map((child, i) =>
                      <SettingsRow
                        key={i * 33}
                        child
                        service={child}
                        info={this.props.children[child].info}
                        disabled={!value}
                        value={!!this.props.children[child].status}
                        infoPress={this.showInfo.bind(this)}
                        onChange={this.toggleOption.bind(this)}
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
  // get all top level options
  const allOptions = Object.keys(state.preferences.storage)
    .reduce((previous, current) => {
      let basic = state.preferences.storage[current]
      basic.info = GetServiceInfo(current)
      previous[current] = basic
      return previous
    }, {})

  const mainOptions = Object.keys(allOptions)
    .filter((key) => allOptions[key].info !== undefined && allOptions[key].info.dependsOn === undefined)
    .reduce((previous, current) => {
      previous[current] = allOptions[current]
      return previous
    }, {})

  // get any storage options that depend on top level options
  const children = Object.keys(allOptions)
    .filter((key) => allOptions[key].info !== undefined && allOptions[key].info.dependsOn !== undefined)
    .reduce((previous, current) => {
      previous[current] = allOptions[current]
      return previous
    }, {})

  return {
    allOptions,
    mainOptions,
    children
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleStorageRequest: (name) => { dispatch(PreferencesActions.toggleStorageRequest(name)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Storage)
