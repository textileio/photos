import { connect } from 'react-redux'
import {
  SetAvatar,
  Props,
  mapStateToProps,
  mapDispatchToProps
} from '../../Containers/SetAvatar'
import { wrapOnboarding } from './WrapOnboarding'

function isSetAvatarComplete(props: Props): boolean {
  // This screen is complete once the user has an avatar
  return props.accountHasAvatar
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(wrapOnboarding(SetAvatar, isSetAvatarComplete))
