import { FeedItemData } from '@textile/react-native-sdk'

export interface Feed {
  readonly loading: boolean
  readonly items: ReadonlyArray<FeedItemData>
  readonly error?: string
}

export interface Groups {
  readonly [key: string]: Feed | undefined
}
