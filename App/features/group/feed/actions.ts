import { createAsyncAction } from 'typesafe-actions'
import { ThreadFeedItem } from '@textile/react-native-sdk'

export const refreshFeed = createAsyncAction(
  '@group/feed/REFRESH_FEED_REQUEST',
  '@group/feed/REFRESH_FEED_SUCCESS',
  '@group/feed/REFRESH_FEED_FAILURE'
)<{ id: string, limit?: number }, { id: string, items: ReadonlyArray<ThreadFeedItem> }, { id: string, error: any }>()

export const loadFeedItems = createAsyncAction(
  '@group/feed/LOAD_FEED_ITEMS_REQUEST',
  '@group/feed/LOAD_FEED_ITEMS_SUCCESS',
  '@group/feed/LOAD_FEED_ITEMS_FAILURE'
)<{ id: string, limit?: number }, { id: string, items: ReadonlyArray<ThreadFeedItem> }, { id: string, error: any}>()
