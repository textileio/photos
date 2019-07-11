// The initialization state of the Textile instance. Some of these are "fake" to provide UX
// uninitialized: before an account is synced/created
// creatingWallet and creatingAccount: the user has initiated the account sync/creation process
// initialized: the node repo is initialized
export type InitializationStatus =
  | 'uninitialized'
  | 'creatingWallet'
  | 'creatingAccount'
  | 'initialized'

export type OnboardingPath = 'default' | 'newAccount' | 'existingAccount'
