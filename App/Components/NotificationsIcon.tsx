import React from 'react'
import { connect } from 'react-redux'
import Icon from '@textile/react-native-icon'
import { RootState } from '../Redux/Types'
import { inboxStatus } from '../features/updates/selectors'

interface ScreenProps {
  size: number
  color: string
  alertColor: string
  name?: string
  alertName?: string
}

class NotificationsIcon extends React.Component<ScreenProps & StateProps> {
  render() {
    const color = this.props.status ? this.props.alertColor : this.props.color
    const name = this.props.status
      ? this.props.alertName || 'bell-alert'
      : this.props.name || 'bell'
    return <Icon name={name} size={this.props.size} color={color} />
  }
}

interface StateProps {
  status: boolean
}

function mapStateToProps(state: RootState): StateProps {
  const status = inboxStatus(state.updates)
  return {
    status
  }
}

export default connect(
  mapStateToProps,
  undefined
)(NotificationsIcon)
