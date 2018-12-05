import { RootState } from './Types'

/**
 * Returns the Account Address
 * Used to filter Account Thread out of Thread lists for display
 * Account Thread Key === Account Address
 */
export function getAddress (state: RootState): string | undefined {
  return state.account.profile.value &&
         state.account.profile.value.address
}
