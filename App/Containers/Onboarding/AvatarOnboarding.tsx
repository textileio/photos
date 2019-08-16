import { connect } from 'react-redux'
import {
  SetAvatar,
  Props,
  mapStateToProps,
  mapDispatchToProps
} from '../../Containers/SetAvatar'
import { wrapOnboarding } from './WrapOnboarding'

function isSetAvatarComplete(props: Props): boolean {
  return false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(wrapOnboarding(SetAvatar, isSetAvatarComplete))
