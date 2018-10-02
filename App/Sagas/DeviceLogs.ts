import {put, select} from 'redux-saga/effects'
import DeviceLogsActions from '../Redux/DeviceLogsRedux'
import {PreferencesSelectors} from "../Redux/PreferencesRedux";

export function * logNewEvent (time: number, event: string, message: string, error?: boolean) {
  if (yield select(PreferencesSelectors.verboseUi)) {
    try {
      yield put(DeviceLogsActions.logNewEvent(time, event, message, !!error))
    } catch (error) {
      // nothing
    }
  }
}
