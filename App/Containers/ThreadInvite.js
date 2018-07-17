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
      from: this.props.navigation.state.params.request.from,
      key: this.props.navigation.state.params.request.key,
      invite: this.props.navigation.state.params.request.invite,
      name: this.props.navigation.state.params.request.name,
      link: this.props.navigation.state.params.link,
      status: 'init'
    }
  }

  confirmRequest = () => {
    this.props.acceptExternalInvite(this.state.link)
    this.setState(() => ({status: 'added'}))
  }

  cancel = () => {
    this.props.removeThreadRequest(this.state.key)
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
            You have been invited by {this.state.from ? this.state.from : 'warning'} to share photos in a shared thread called, {this.state.name ? this.state.name : 'warning'}. By joining, any members of the thread will be able to send you photos and will be able to see photos that you share to the group.
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
            title='Cancel'
            accessibilityLabel='cancel'
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
    if (!this.state.key) {
      return this.renderError('There was an issue pairing with your new device. This may be caused by network connectivity or other issues. Please try again. If it continues, please report the issue with Textile.')
    } else if (this.props.threads.some((t) => t.id === this.state.key)) {
      // the thread already exists
      return this.renderError('You are already a member of the thread you are trying to join.')
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
    threads: state.threads && state.threads.threadItems ? state.threads.threadItems : [],
    online: nodeState && online
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    acceptExternalInvite: (link) => { dispatch(ThreadsAction.acceptExternalInviteRequest(link)) },
    removeThreadRequest: (id) => { dispatch(ThreadsAction.removeThreadRequest(id)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadInvite)
