import { Store } from 'redux'
import { Platform, PermissionsAndroid } from 'react-native'

import { RootState } from '../../Redux/Types'

import TriggersActions from '../../Redux/TriggersRedux'

export default class LocationEventHandler {
  public store: Store<RootState>
  public status: boolean

  constructor(store: Store<RootState>) {
    this.store = store
    this.status = false
  }

  public handleNewPosition() {
    this.store.dispatch(TriggersActions.locationUpdate())
  }

  public setup() {
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

  public async setupAndroid() {
    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (hasPermission) {
      this.watchPosition()
    }
  }

  public watchPosition() {
    navigator.geolocation.watchPosition(this.handleNewPosition.bind(this), undefined, { useSignificantChanges: true })
  }
}
