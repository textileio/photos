import React from 'react'
import { Image, View, Text, Button, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import ImageSc from 'react-native-scalable-image'

import Toolbar from '../../components/Toolbar'

import styles from './statics/styles'
import ThreadsAction from '../../../Redux/ThreadsRedux'
import PhotoViewingActions from '../../../Redux/PhotoViewingRedux'
import style from '../../../Containers/Styles/PairingViewStyle'

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
  static navigationOptions = () => {
    return {
      tabBarVisible: false
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
    this.setState(() => ({ status: 'added' }))
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
      <View style={styles.contentContainer}>
        <ImageSc style={styles.mainImage} width={125} source={require('./statics/image.png')} />
        <Text style={styles.deviceId}>You have been invited by {this.state.inviter ? this.state.inviter : 'warning'} to join {this.state.name ? this.state.name : 'warning'}.</Text>
        <View style={styles.buttonList}>
          <View style={styles.buttonSingle}>
            <Button
              style={styles.button}
              title='Ignore'
              accessibilityLabel='ignore'
              onPress={this.cancel}
            />
          </View>
          <View style={styles.buttonSingle}>
            <Button
              style={styles.button}
              title={this.props.online === true ? 'Join' : 'Connecting'}
              accessibilityLabel='Join'
              onPress={this.confirmRequest.bind(this)}
              disabled={!this.props.online === true}
            />
          </View>
        </View>
        {!this.props.online && <ActivityIndicator style={{ marginTop: 10, flex: 1 }} size='large' color='#000000' animating={this.state.status !== 'success'} />
        }
      </View>
    )
  }

  renderError (message) {
    return (
      <View style={styles.contentContainer}>
        <ImageSc style={styles.mainImage} width={125} source={require('./statics/image.png')} />
        <Text style={styles.deviceId}>{message}</Text>
        <View style={styles.buttonList}>
          <View style={styles.buttonSingle}>
            <Button
              style={styles.button}
              title='Exit'
              accessibilityLabel='exit'
              onPress={this.cancel}
            />
          </View>
          <View style={styles.buttonSingle}>
            <Button
              style={style.button}
              title='Retry'
              accessibilityLabel='retry'
              onPress={this.confirmRequest.bind(this)}
            />
          </View>
        </View>
      </View>
    )
  }

  renderStatus (message, cont) {
    return (
      <View style={styles.contentContainer}>
        <ImageSc style={styles.mainImage} width={125} source={require('./statics/image.png')} />
        <Text style={styles.deviceId}>{message}</Text>
        <View style={styles.buttonSingle}>
          <Button
            style={styles.button}
            title={cont ? 'Continue' : 'Wait'}
            accessibilityLabel='Continue'
            onPress={this.cancel}
            disabled={!cont}
          />
        </View>
        {!cont && <ActivityIndicator style={{ marginTop: 10, flex: 1 }} size='large' color='#000000' animating={this.state.status !== 'success'} />
        }
      </View>
    )
  }

  renderBody () {
    if (!this.state.valid) {
      return this.renderError('There was an issue with the Thread invite. Be sure you got this invite from a trusted Textile user using the latest Textile app.')
    } else if (this.state.status === 'init' && this.props.invite && this.props.invite.id) {
      // the thread already exists
      return this.renderError('You have already accepted this invite.')
    } else if (this.state.status === 'confirmed') {
      return this.renderStatus('Locating...', false)
    } else if (this.state.status === 'added') {
      if (this.props.invite && this.props.invite.id) {
        return this.renderStatus('SUCCESS!', true)
      } else if (this.props.invite && this.props.invite.error) {
        return this.renderError(this.props.invite.error.message)
      }
      return this.renderStatus('Joining...', false)
    }
    return this.renderConfirm()
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Toolbar
          style={styles.toolbar}
          left={<TouchableOpacity onPress={() => { this.cancel() }}>
            <Image
              style={styles.toolbarLeft}
              source={require('./statics/icon-arrow-left.png')}
            />
          </TouchableOpacity>}>
          <Text style={styles.toolbarTitle}>Thread Invite</Text>
          {this.renderBody()}
        </Toolbar>
      </ScrollView>
    )
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
    removeThreadRequest: (threadId) => { dispatch(PhotoViewingActions.removeThreadRequest(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadInvite)
