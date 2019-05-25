import { RootState } from './Types'
import { InboundInvite, OutboundInvite } from './ThreadsRedux'

export function pendingInviteLink(state: RootState) {
  return state.threads.pendingInviteLink
}

export function inboundInviteByThreadId(
  state: RootState,
  threadId: string
): InboundInvite | undefined {
  return state.threads.inboundInvites.find(invite => invite.id === threadId)
}

export function inboundInviteByThreadName(
  state: RootState,
  threadName: string
): InboundInvite | undefined {
  return state.threads.inboundInvites.find(invite => invite.name === threadName)
}

export function inboundInvites(state: RootState): ReadonlyArray<InboundInvite> {
  return state.threads.inboundInvites.filter(invite => !invite.dismissed)
}
