import { createAction, ActionType, getType } from 'typesafe-actions'
import { create } from '../../node_modules/@types/react-test-renderer';
import { resolve } from 'path';

const actions = {
  someAction: createAction('AN_ACTION', resolve => {
    return () => resolve()
  })
}

export type ImagesAction = ActionType<typeof actions>

type Image = {
  readonly uri: string
}

type ImageMap = {
  [key: string]: Image
}

export type ImagesState = {
  readonly processing: boolean
  readonly error?: Error
  readonly images: ImageMap
}

const initalImages: ImageMap = {
  'asset://foo': { uri: 'asset://foo' },
  'asset://bar': { uri: 'asset://bar' },
  'asset://baz': { uri: 'asset://baz' }
}

export const initialState: ImagesState = {
  processing: false,
  images: initalImages
}

export function reducer (state: ImagesState = initialState, action: ImagesAction): ImagesState {
  return state
}

export default actions
