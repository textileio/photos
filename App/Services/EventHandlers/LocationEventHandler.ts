import { Store } from 'redux'
import { Platform, PermissionsAndroid } from 'react-native'

import { RootState } from '../../Redux/Types'

import TriggersActions from '../../Redux/TriggersRedux'

export default class LocationEventHandler {
  store: Store<RootState>
  status: boolean

  constructor(store: Store<RootState>) {
    this.store = store
    this.status = false
  }

  handleNewPosition () {
    this.store.dispatch(TriggersActions.locationUpdate())
  }

  setup () {
    if (!this.status) {
      const currentState = this.store.getState()
      if (currentState.preferences.services.backgroundLocation.status === true) {
        this.status = true
        if (Platform.OS === 'android') {
          this.setupAndroid()
        } else {
          this.watchPosition()
        }
      }
    }
  }

  async setupAndroid() {
    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (hasPermission) {
      this.watchPosition()
    }
  }

  watchPosition () {
    navigator.geolocation.watchPosition(this.handleNewPosition.bind(this), undefined, { useSignificantChanges: true })
  }

  tearDown () {

  }
}
