import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  logNewEvent: createAction('LOG_NEW_EVENT', (resolve) => {
    return (time: number, event: string, message: string, error: boolean) => resolve({time, event, message, error})
  }),
  clearLogs: createAction('CLEAR_LOGS')
}

export type DeviceLogsAction = ActionType<typeof actions>

export interface DeviceLogsRow {
  readonly time: number,
  readonly event: string,
  readonly message: string,
  readonly error: boolean
}

export interface DeviceLogsState {
  readonly logs: ReadonlyArray<DeviceLogsRow>
}

export const initialState: DeviceLogsState = {
  logs: []
}

export function reducer (state: DeviceLogsState = initialState, action: DeviceLogsAction): DeviceLogsState {
  switch (action.type) {
    case getType(actions.logNewEvent): {
      const logRow: DeviceLogsRow = {
        time: action.payload.time,
        event: action.payload.event,
        message: action.payload.message,
        error: action.payload.error
      }
      const logs = [
        logRow,
        ...state.logs
      ].slice(0, 500)
      return { ...state, logs }
    }
    case getType(actions.clearLogs): {
      return { ...state, logs: [] }
    }
    default:
      return state
  }
}

export default actions
