import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Platform } from 'react-native'
import { RootAction, RootState } from '../../../Redux/Types'
import PreferencesActions, { ServiceType, TourScreens, PreferencesSelectors } from '../../../Redux/PreferencesRedux'
import PermissionsInfo from '../../components/PermissionsInfo'
import HeaderButtons from 'react-navigation-header-buttons'
import SettingsRow from '../../components/SettingsRow'
import GetServiceInfo from './GetServiceInfo'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import styles from './statics/styles'
import Avatar from '../../../Components/Avatar'
import { NavigationActions, NavigationScreenProps } from 'react-navigation'

interface DispatchProps {
  toggleServicesRequest: (name: ServiceType) => void
  completeScreen: (name: TourScreens) => void
  toggleNodeState: () => void
  toggleNodeErrors: () => void
  toggleNodeStateOverlay: () => void
}

export interface ServiceInfo {
  title: string,
  subtitle: string,
  dependsOn?: string
  details?: string
}

interface ServiceSummary {
  [key: string]: {status: boolean, info?: ServiceInfo}
}

interface StateProps {
  allServices: ServiceSummary
  services: ServiceSummary
  children: ServiceSummary
  verboseUi: boolean
  verboseUiOptions: {
    nodeStateOverlay: boolean
    nodeStateNotifications: boolean
    nodeErrorNotifications: boolean
  }
}

interface OwnProps {
  complete: boolean
  iOS: boolean
  cameraRoll: boolean
  locationBackground: boolean
  infoVisible: boolean
  info?: ServiceInfo
}

type Props = DispatchProps & StateProps & OwnProps

class Notifications extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps<{}>) => {
    return {
      headerTitle: 'Notifications',
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <TextileItem
            title='Back'
            iconName='arrow-left'
            /* tslint:disable-next-line */
            onPress={() => {
              navigation.dispatch(NavigationActions.back())
            }}
          />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <HeaderButtons>
          <HeaderButtons.Item
            title='Avatar'
            buttonWrapperStyle={{ marginLeft: 11, marginRight: 11 }}
            ButtonElement={<Avatar style={{ width: 32, height: 32 }} />}
          />
        </HeaderButtons>
      )
    }
  }

  state: OwnProps = {
    complete: false,
    iOS: Platform.OS === 'ios',
    cameraRoll: false,
    locationBackground: false,
    infoVisible: false
  }

  toggleService = (name: string) => {
    if (name === 'notifications') {
      // never prompt the user later to get those
      this.props.completeScreen(name)
    }
    this.props.toggleServicesRequest(name as ServiceType)
  }

  hideInfo = () => {
    this.setState({ infoVisible: false })
  }

  showInfo = (service: string) => {
    const info = GetServiceInfo(service)
    this.setState({ infoVisible: true, info })
  }

  render() {
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
                const children = Object.keys(this.props.children)
                  .filter((key) => {
                    const info = this.props.children[key].info
                    return info && info.dependsOn === service
                  })
                  .reduce((previous, current) => {
                    previous[current] = this.props.children[current]
                    return previous
                  }, {} as ServiceSummary)

                return (
                  <View key={i} >
                    <SettingsRow
                      service={service}
                      info={this.props.services[service].info || {title: 'unknown', subtitle: 'unknown'}}
                      value={value}
                      infoPress={this.showInfo}
                      onChange={this.toggleService}
                    />
                    {children && Object.keys(children).map((child, i) =>
                      <SettingsRow
                        key={i * 33}
                        child={child}
                        service={child}
                        info={this.props.children[child].info || {title: 'unknown', subtitle: 'unknown'}}
                        disabled={!value}
                        value={!!this.props.children[child].status}
                        infoPress={this.showInfo}
                        onChange={this.toggleService}
                      />
                    )}
                  </View>
                )
              }
            )}
          </View>

          {this.props.verboseUi &&
            <View style={styles.listContainer}>
              <View>
                <SettingsRow
                  service={'StateOverlay'}
                  info={{title: 'State Overlay', subtitle: 'Banner indicating Node State'}}
                  value={this.props.verboseUiOptions.nodeStateOverlay}
                  /* tslint:disable-next-line */
                  infoPress={() => {}}
                  onChange={this.props.toggleNodeStateOverlay}
                />
              </View>
              <View>
                <SettingsRow
                  service={'NodeState'}
                  info={{title: 'Node State Change', subtitle: 'Local notifications'}}
                  value={this.props.verboseUiOptions.nodeStateNotifications}
                  /* tslint:disable-next-line */
                  infoPress={() => {}}
                  onChange={this.props.toggleNodeState}
                />
              </View>
              <View>
                <SettingsRow
                  service={'NodeErrors'}
                  info={{title: 'Node Errors', subtitle: 'Local notifications'}}
                  value={this.props.verboseUiOptions.nodeErrorNotifications}
                  /* tslint:disable-next-line */
                  infoPress={() => {}}
                  onChange={this.props.toggleNodeErrors}
                />
              </View>
            </View>
          }
        </ScrollView>
        {this.state.infoVisible &&
          <PermissionsInfo
            info={this.state.info || {title: 'Unknown Permission', subtitle: 'unknown'}}
            close={this.hideInfo}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  // get all top level services
  const allServices = Object.keys(state.preferences.services)
    .reduce((previous, current) => {
      const basic = {
        status: PreferencesSelectors.serviceStatus(state, current as ServiceType),
        info: GetServiceInfo(current)
      }
      previous[current] = basic
      return previous
    }, {} as ServiceSummary)

  const services = Object.keys(allServices)
    .filter((key) => {
      const info = allServices[key].info
      return info !== undefined && info.dependsOn === undefined
    })
    .reduce((previous, current) => {
      previous[current] = allServices[current]
      return previous
    }, {} as ServiceSummary)

  // get any services that depend on top level services
  const children = Object.keys(allServices)
    .filter((key) => {
      const info = allServices[key].info
      return info !== undefined && info.dependsOn !== undefined
    })
    .reduce((previous, current) => {
      previous[current] = allServices[current]
      return previous
    }, {} as ServiceSummary)

  return {
    allServices,
    services,
    children,
    verboseUi: state.preferences.verboseUi,
    verboseUiOptions: state.preferences.verboseUiOptions
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    toggleServicesRequest: (name) => { dispatch(PreferencesActions.toggleServicesRequest(name)) },
    completeScreen: (name) => { dispatch(PreferencesActions.completeTourSuccess(name)) },
    toggleNodeState: () => { dispatch(PreferencesActions.toggleNodeStateNotifications()) },
    toggleNodeErrors: () => { dispatch(PreferencesActions.toggleNodeErrorNotifications()) },
    toggleNodeStateOverlay: () => { dispatch(PreferencesActions.toggleNodeStateOverlay()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
