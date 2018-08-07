import React from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import ThreadsAction from '../Redux/ThreadsRedux'

// Styles
import style from './Styles/PairingViewStyle'
import photosStyle from './Styles/TextilePhotosStyle'

class ThreadInvite extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      inviter: this.props.navigation.state.params.request.inviter,
      inviteId: this.props.navigation.state.params.request.id,
      inviteKey: this.props.navigation.state.params.request.key,
      name: this.props.navigation.state.params.request.name,
      valid: this._isValid(this.props.navigation.state.params.request),
      status: 'init'
    }
  }

  _isValid = (request) => {
    return request.inviter && request.inviter !== '' &&
      request.key && request.key !== '' &&
      request.id && request.id !== '' &&
      request.name && request.name !== ''
  }

  confirmRequest = () => {
    this.props.acceptExternalInvite(this.state.inviteId, this.state.inviteKey, this.state.name, this.state.inviter)
    this.setState(() => ({status: 'added'}))
  }

  cancel = () => {
  // TODO: Figure out the right way to cancel a request. id here is the inviteId not a id
  //   this.props.removeThreadRequest(this.state.id)
    this.props.navigation.navigate('OnboardingCheck')
  }

  continue = () => {
    this.props.navigation.navigate('OnboardingCheck')
  }

  renderConfirm () {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.message}>
            You have been invited by {this.state.inviter ? this.state.inviter : 'warning'} to share photos in a shared thread called, {this.state.name ? this.state.name : 'warning'}. By joining, any members of the thread will be able to send you photos and will be able to see photos that you share to the group.
          </Text>
          <Button
            style={style.button}
            title={this.props.online === true ? 'Join now' : 'Waiting for Connection'}
            accessibilityLabel='join now'
            onPress={this.confirmRequest.bind(this)}
            disabled={!this.props.online === true}
          />
          <View style={style.buttonMargin} />
          <Button
            style={style.button}
            title='Cancel'
            accessibilityLabel='cancel'
            onPress={this.cancel}
          />
        </View>
      </View>
    )
  }

  renderPairing (title) {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.status}>{title}</Text>
          <ActivityIndicator size='large' color='#000000' animating={this.state.status !== 'success'} />
          <View style={style.buttonMargin} />
          <Button
            style={style.button}
            title='Continue'
            accessibilityLabel='continue'
            onPress={this.continue.bind(this)}
          />
          <Button
            style={style.button}
            title='Exit'
            accessibilityLabel='exit'
            onPress={this.cancel.bind(this)}
          />
        </View>
      </View>
    )
  }

  renderSuccess (status, buttonText) {
    // TODO: redirect the user to the newly joined thread
    const button = buttonText || 'Continue'
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.status}>{status}</Text>
          <View style={style.buttonMargin} />
          <Button
            style={style.button}
            title={button}
            accessibilityLabel={button}
            onPress={this.continue.bind(this)}
          />
        </View>
      </View>
    )
  }

  renderError (message) {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.status}>ERROR</Text>
          <Text style={style.error}>
            Error message: {message}
          </Text>
          <Button
            style={style.button}
            title='Retry'
            accessibilityLabel='retry'
            onPress={this.confirmRequest.bind(this)}
          />
          <Button
            style={style.button}
            title='Continue'
            accessibilityLabel='continue'
            onPress={this.continue.bind(this)}
          />
        </View>
      </View>
    )
  }

  render () {
    if (!this.state.valid) {
      return this.renderError('There was an issue with the Thread invite. Be sure you got this invite from a trusted Textile user using the latest Textile app.')
    } else if (this.state.status === 'init' && this.props.invite && this.props.invite.id) {
      // the thread already exists
      return this.renderError('You have already accepted this invite.')
    } else if (this.state.status === 'confirmed') {
      return this.renderPairing('Locating...', 'Continue in background')
    } else if (this.state.status === 'added') {
      if (this.props.invite && this.props.invite.id) {
        return this.renderSuccess('SUCCESS!')
      } else if (this.props.invite && this.props.invite.error) {
        return this.renderError(this.props.invite.error.message)
      }
      return this.renderSuccess('Joining...', 'Continue in background')
    }
    return this.renderConfirm()
  }
}

const mapStateToProps = (state, ownProps) => {
  const online = state.textileNode && state.textileNode.online && state.textileNode.online ? state.textileNode.online : false
  const nodeState = state.textileNode && state.textileNode.nodeState ? state.textileNode.nodeState.state === 'started' : false

  const navParams = ownProps.navigation.state.params || {}
  const inviteId = navParams.request.id || undefined

  return {
    invite: state.threads.inboundInvites.find(invite => invite.inviteId === inviteId),
    online: nodeState && online
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    acceptExternalInvite: (inviteId, inviteKey, name, inviter) => { dispatch(ThreadsAction.acceptExternalInviteRequest(inviteId, inviteKey, name, inviter)) },
    removeThreadRequest: (threadId) => { dispatch(ThreadsAction.removeThreadRequest(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadInvite)
