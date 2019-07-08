// The initialization state of the Textile instance
// Uninitialized: before an account is synced/created
// Initializing: the user has initiated the account sync/creation process
// Initialized: the instance is initialized as an account peer
export enum TextileInstanceState {
  uninitialized = 'uninitialized',
  initializing = 'initializing',
  initialized = 'initialized'
}
