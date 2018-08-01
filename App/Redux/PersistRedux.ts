import { createAction, ActionType, getType } from 'typesafe-actions'
import { PersistState } from 'redux-persist'

const actions = {}

export type PersistAction = ActionType<typeof actions>

const initialState: PersistState = {
  version: 0,
  rehydrated: false
}

export function reducer(state: PersistState = initialState, action: any): PersistState {
  return state
}