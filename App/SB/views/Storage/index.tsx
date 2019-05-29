import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Platform } from 'react-native'
import PreferencesActions, {
  PreferencesSelectors,
  StorageType
} from '../../../Redux/PreferencesRedux'
import PermissionsInfo from '../../components/PermissionsInfo'
import HeaderButtons from 'react-navigation-header-buttons'
import SettingsRow from '../../components/SettingsRow'
import getServiceInfo, { StorageDescription } from './GetServiceInfo'

import {
  TextileHeaderButtons,
  Item as TextileItem
} from '../../../Components/HeaderButtons'

import styles from './statics/styles'
import Avatar from '../../../Components/Avatar'
import { NavigationActions, NavigationScreenProps } from 'react-navigation'
import { RootState, RootAction } from '../../../Redux/Types'
import { Dispatch } from 'redux'

type Props = DispatchProps & StateProps

interface PropState {
  complete: boolean
  iOS: boolean
  cameraRoll: boolean
  locationBackground: boolean
  infoVisible: boolean
  info?: StorageDescription
}
class Storage extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps<{}>) => {
    const goBack = () => {
      navigation.dispatch(NavigationActions.back())
    }
    return {
      headerTitle: 'Storage',
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <TextileItem title="Back" iconName="arrow-left" onPress={goBack} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <HeaderButtons>
          <HeaderButtons.Item
            title="Avatar"
            buttonWrapperStyle={{ marginLeft: 11, marginRight: 11 }}
            ButtonElement={<Avatar style={{ width: 32, height: 32 }} />}
          />
        </HeaderButtons>
      )
    }
  }
  state: PropState = {
    complete: false,
    iOS: Platform.OS === 'ios',
    cameraRoll: false,
    locationBackground: false,
    infoVisible: false
  }
  toggleOption = (name: string) => {
    this.props.toggleStorageRequest(name as StorageType)
  }

  hideInfo = () => {
    this.setState({ infoVisible: false })
  }

  showInfo = (service: string) => {
    const info = getServiceInfo(service)
    this.setState({ infoVisible: true, info })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose your photo storage options.</Text>
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.listContainer}>
            {Object.keys(this.props.mainOptions).map((option, i) => {
              const value = Boolean(this.props.mainOptions[option].status)
              const info = this.props.mainOptions[option].info || {
                title: 'unknown',
                subtitle: 'unknown'
              }
              return (
                <View key={i}>
                  <SettingsRow
                    service={option}
                    info={info}
                    value={value}
                    infoPress={this.showInfo}
                    onChange={this.toggleOption}
                  />
                </View>
              )
            })}
          </View>
        </ScrollView>
        {this.state.infoVisible && this.state.info && (
          <PermissionsInfo info={this.state.info} close={this.hideInfo} />
        )}
      </View>
    )
  }
}

interface StorageOption {
  status: boolean
  info?: StorageDescription
}
interface StateProps {
  allOptions: { [key: string]: StorageOption }
  mainOptions: { [key: string]: StorageOption }
}

const mapStateToProps = (state: RootState): StateProps => {
  // get all top level options
  const input: { [key: string]: StorageOption } = {}
  const allOptions: { [key: string]: StorageOption } = Object.keys(
    state.preferences.storage
  ).reduce((previous, current) => {
    const basic: StorageOption = {
      status: PreferencesSelectors.storage(state, current as StorageType)
        .status,
      info: getServiceInfo(current)
    }
    previous[current] = basic
    return previous
  }, input)

  const mainOptions = allOptions

  // get any storage options that depend on top level options

  return {
    allOptions,
    mainOptions
  }
}

interface DispatchProps {
  toggleStorageRequest: (name: StorageType) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    toggleStorageRequest: name => {
      dispatch(PreferencesActions.toggleStorageRequest(name))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Storage)
