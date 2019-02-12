import { ThreadFeedItem } from '@textile/react-native-sdk'

export interface Feed {
  readonly loading: boolean
  readonly items: ReadonlyArray<ThreadFeedItem>
  readonly error?: string
}

export interface Groups {
  readonly [key: string]: Feed | undefined
}
