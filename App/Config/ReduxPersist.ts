import { AsyncStorage } from 'react-native'
import { createMigrate, PersistConfig, MigrationManifest } from 'redux-persist'

const migrations: MigrationManifest = {
  0: (persistedState) => {
    const state = persistedState as any
    // Migration to add user preferences with option for verboseUi
    return {
      ...state,
      textile: {
        ...state.textile,
        preferences: {
          verboseUi: false
        },
        camera: {}
      }
    }
  },
  1: (persistedState) => {
    const state = persistedState as any
    // Migration to add remaining retry attempts to any persisted image data
    const updatedItems = state.textile.images.items.map((item: any) => {
      return { ...item, remainingUploadAttempts: 3 }
    })
    return {
      ...state,
      textile: {
        ...state.textile,
        images: {
          ...state.textile.images,
          items: updatedItems
        }
      }
    }
  },
  2: (persistedState) => {
    const state = persistedState as any
    const uris = state.textile.camera && state.textile.camera.processed ? state.textile.camera.processed : []
    const processed: { [key: string]: 'complete' } = {}
    for (const uri of uris) {
      processed[uri] = 'complete'
    }
    return {
      ...state,
      textile: {
        ...state.textile,
        camera: { processed }
      }
    }
  },
  3: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      textile: {
        ...state.textile,
        onboarded: false
      }
    }
  },
  4: (persistedState) => {
    const state = persistedState as any
    // Not migrating devices because we didn't previously have meaningful device data
    return {
      ...state,
      preferences: {
        onboarded: state.textile.onboarded,
        verboseUi: state.textile.preferences.verboseUi
      }
    }
  },
  5: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      cameraRoll: {
        ...state.cameraRoll,
        pendingShares: {}
      }
    }
  },
  6: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      preferences: {
        ...state.preferences,
        tourScreens: {
          wallet: true
        }
      }
    }
  },
  7: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      preferences: {
        ...state.preferences,
        tourScreens: {
          ...state.preferences.tourScreens,
          threads: true
        }
      }
    }
  },
  8: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      preferences: {
        ...state.preferences,
        tourScreens: {
          ...state.preferences.tourScreens,
          feed: true,
          notifications: true,
          threads: true
        },
        services: {
          notifications: {
            status: false
          },
          photoAddedNotification: {
            status: true
          },
          receivedInviteNotification: {
            status: true
          },
          deviceAddedNotification: {
            status: false
          },
          commentAddedNotification: {
            status: false
          },
          likeAddedNotification: {
            status: false
          },
          peerJoinedNotification: {
            status: false
          },
          peerLeftNotification: {
            status: false
          },
          backgroundLocation: {
            status: false
          }
        }
      }
    }
  },
  9: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      preferences: {
        ...state.preferences,
        storage: {
          autoPinPhotos: {
            status: false
          },
          storeHighRes: {
            status: false
          },
          deleteDeviceCopy: {
            status: false
          },
          enablePhotoBackup: {
            status: false
          },
          enableWalletBackup: {
            status: false
          }
        }
      }
    }
  },
  10: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      preferences: {
        ...state.preferences,
        tourScreens: {
          ...state.preferences.tourScreens,
          threadView: true
        }
      }
    }
  },
  11: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      preferences: {
        ...state.preferences,
        tourScreens: {
          ...state.preferences.tourScreens,
          location: true
        }
      }
    }
  },
  12: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      preferences: {
        ...state.preferences,
        tourScreens: {
          ...state.preferences.tourScreens,
          threadsManager: true
        }
      }
    }
  },
  13: (persistedState) => {
    const state = persistedState as any
    return {
      ...state,
      preferences: {
        ...state.preferences,
        viewSettings: {
          selectedWalletTab: 'Photos'
        }
      }
    }
  }
}

const persistConfig: PersistConfig = {
  key: 'primary',
  storage: AsyncStorage,
  version: 13,
  whitelist: ['preferences', 'uploadingImages', 'processingImages', 'cameraRoll', 'storage', 'deviceLogs'],
  migrate: createMigrate(migrations, { debug: false })
}

export default persistConfig
