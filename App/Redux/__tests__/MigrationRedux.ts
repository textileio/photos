import actions, { reducer } from '../MigrationRedux'
import { getAnnouncement, getNetwork } from '../MigrationSelectors'
import { PeerDetails, MigrationState } from '../MigrationRedux'
import { RootState } from '../Types'

const initialState = reducer(undefined, {} as any)
const profile: MigrationState = {
  photosCount: 0,
  threadsCount: 0,
  photoDownloads: {},
  localProcessingTasks: {},
  status: 'none'
}

const peerDetails: PeerDetails = {
  currentPeerId: 'ABC-DEF-GHI',
  previousPeerId: 'XYZ-UVW-RST',
  currentAddress: '123-456-789',
  previousUsername: 'jest test'
}

const network: string[] = [
  'AAA',
  'BBB',
  'CCC'
]

describe('migration', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('migration', () => {
    let migrationState = initialState
    it('should store peer details to migration', () => {
      migrationState =  reducer(
        migrationState,
        actions.peerAnnouncement(peerDetails)
      )
      expect(migrationState.peerAnnouncement).toEqual(peerDetails)
    })
    it('should select correct announcement details', () => {
      const selected = getAnnouncement({migration: migrationState} as RootState)
      expect(selected).toEqual(peerDetails)
    })
    it('should store network details for migration', () => {
      migrationState =  reducer(
        migrationState,
          actions.connectToPeers(
            network
          )
        )
      expect(migrationState.network).toEqual(network)
    })
    it('should select correct network details', () => {
      const selected = getNetwork({migration: migrationState} as RootState)
      expect(selected).toEqual(network)
    })
  })
})
