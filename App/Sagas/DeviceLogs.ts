import {put, select} from 'redux-saga/effects'
import DeviceLogsActions from '../Redux/DeviceLogsRedux'
import {PreferencesSelectors} from '../Redux/PreferencesRedux'

export function * logNewEvent (event: string, message: string, error?: boolean) {
  if (yield select(PreferencesSelectors.verboseUi)) {
    try {
      yield put(DeviceLogsActions.logNewEvent(new Date().getTime(), event, message, !!error))
    } catch (error) {
      // nothing
    }
  }
}
