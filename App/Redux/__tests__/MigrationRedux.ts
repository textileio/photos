import actions, { reducer } from '../MigrationRedux'
import { getAnnouncement, getNetwork } from '../MigrationSelectors'
import { PeerDetails, MigrationState } from '../MigrationRedux'
import { RootState } from '../Types'

const initialState = reducer(undefined, {} as any)
const profile: MigrationState = {
  photoDownloads: {},
  localProcessingTasks: {},
  status: 'none'
}

const peerDetails: PeerDetails = {
  previousPeerId: 'XYZ-UVW-RST',
  previousUsername: 'jest test',
  currentContactInfo: {
    id: 'id',
    address: 'address',
    created: 'created',
    updated: 'updated'
  }
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
      expect(migrationState.peerAnnouncement).toBeDefined()
      expect(migrationState.peerAnnouncement!.peerDetails).toEqual(peerDetails)
    })
    it('should select correct announcement details', () => {
      const selected = getAnnouncement({migration: migrationState} as RootState)
      expect(selected).toBeDefined()
      expect(selected!.peerDetails).toEqual(peerDetails)
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
