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
      request.inviteKey && request.inviteKey !== '' &&
      request.inviteId && request.inviteId !== '' &&
      request.name && request.name !== ''
  }

  confirmRequest = () => {
    this.props.acceptExternalInvite(this.state.inviteId, this.state.inviteKey)
    this.setState(() => ({status: 'added'}))
  }

  cancel = () => {
  // TODO: Figure out the right way to cancel a request. id here is the inviteId not a threadId
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

  renderSuccess () {
    // TODO: redirect the user to the newly joined thread
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.status}>Success!</Text>
          <View style={style.buttonMargin} />
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

  renderError (message) {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.status}>ERROR</Text>
          <Text style={style.message}>
            {message}
          </Text>
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
    if (!this.state.isValid) {
      return this.renderError('There was an issue with the Thread invite. Be sure you got this invite from a trusted Textile user using the latest Textile app.')
    } else if (this.props.threads.some((t) => t.id in this.state.invites)) {
      // the thread already exists
      return this.renderError('You have already accepted this invite.')
    } else if (this.state.status === 'confirmed') {
      return this.renderPairing('JOINING')
    } else if (this.state.status === 'added') {
      return this.renderSuccess()
    }
    return this.renderConfirm()
  }
}

const mapStateToProps = state => {
  const online = state.ipfs && state.ipfs.online && state.ipfs.online ? state.ipfs.online : false
  const nodeState = state.ipfs && state.ipfs.nodeState ? state.ipfs.nodeState.state === 'started' : false
  return {
    invites: state.threads.inboundInvites.filter((inv) => inv.id && !inv.error).map((inv) => inv.inviteId),
    online: nodeState && online
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    acceptExternalInvite: (inviteId, inviteKey) => { dispatch(ThreadsAction.acceptExternalInviteRequest(inviteId, inviteKey)) },
    removeThreadRequest: (threadId) => { dispatch(ThreadsAction.removeThreadRequest(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadInvite)
