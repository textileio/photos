import React, { Fragment } from 'react'
import {Dispatch} from 'redux'
import { connect } from 'react-redux'
import {RootAction, RootState} from '../Redux/Types'
import { View, Image, Button, ViewStyle, ImageStyle, Text, TextStyle } from 'react-native'

import ProgressBar from './ProgressBar'
import ThreadsActions, { InboundInvite } from '../Redux/ThreadsRedux'
import UIActions from '../Redux/UIRedux'

const CONTAINER: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: 80,
  marginBottom: 10
}

const ITEM = {
  marginLeft: 12
}

const LAST_ITEM = {
  marginRight: 12
}

const IMAGE: ImageStyle = {
  ...ITEM,
  width: 80,
  height: 80
}

const STACK: ViewStyle = {
  ...ITEM,
  ...LAST_ITEM,
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'stretch'
}

const STATUS: TextStyle = {
  fontFamily: 'BentonSans',
  fontSize: 12,
  color: 'rgb(185, 185, 185)',
  textAlign: 'center',
  marginTop: 6,
  marginBottom: 6
}

const ERROR: TextStyle = {
  ...ITEM,
  ...STATUS,
  flex: 1
}

const SUCCESS: TextStyle = {
  ...ITEM,
  ...STATUS,
  flex: 1
}

class ProcessingThread extends React.Component<InboundInvite & DispatchProps & StateProps> {
  dismiss (inviteId: string) {
    return () => {
      this.props.dismiss(inviteId)
    }
  }
  retry (inviteId: string, key: string) {
    return () => {
      this.props.retry(inviteId, key)
    }
  }
  view (id: string, name: string) {
    return () => {
      this.props.navigateToThread(id, name)
    }
  }

  getImage () {
    switch (this.props.stage) {
      case ('error'):
        return (
          <Image style={IMAGE} source={require('../Images/v2/join-thread-error.png')} resizeMode={'cover'} />
        )
      case ('complete'):
        return (
          <Image style={IMAGE} source={require('../Images/v2/join-thread-success.png')} resizeMode={'cover'} />
        )
      default:
        return (
          <Image style={IMAGE} source={require('../Images/v2/join-thread.png')} resizeMode={'cover'} />
        )
    }
  }

  getMessage (stage: string, threadName?: string) {
    const name = threadName || 'new thread'
    const body = stage === 'complete' ? 'Successfully joined' : stage[0].toUpperCase() + stage.substr(1).toLowerCase()
    const message = `${body} ${name}`
    return message
  }

  render () {
    const props = this.props
    const dismiss = this.dismiss(this.props.inviteId)
    const retry = this.retry(this.props.inviteId, this.props.inviteKey)

    const errorMessage = props.errorMessage
    const progress = props.stage === 'complete' ? 1.0 : 0.33
    const message = this.getMessage(props.stage, props.name)

    let content: JSX.Element
    if (errorMessage) {
      content = (
        <Fragment>
          <Text style={ERROR}>{`Error: ${errorMessage}`}</Text>
          <Button title={'Retry'} onPress={retry} />
          <Button title={'Dismiss'} onPress={dismiss} />
        </Fragment>
      )
    } else if (props.stage === 'complete') {
      let view = () => {}
      if (this.props.id && this.props.name) {
        view = this.view(this.props.id, this.props.name)
      }
      content = (
        <Fragment>
          <Text style={SUCCESS}>{message}</Text>
          <Button title={'View'} onPress={view} />
          <Button title={'Dismiss'} onPress={dismiss} />
        </Fragment>
      )
    } else {
      content = (
        <Fragment>
          <View style={STACK}>
            <Text style={STATUS} />
            <ProgressBar progress={progress} />
            <Text style={STATUS}>{message}</Text>
          </View>
          <Button title={'Dismiss'} onPress={dismiss} />
        </Fragment>
      )
    }

    return (
      <View style={CONTAINER}>
        {this.getImage()}
        {content}
      </View>
    )
  }
}

export interface StateProps {
  errorMessage?: string
}

const mapStateToProps = (state: RootState, ownProps: InboundInvite): StateProps => {
  return {
    errorMessage: ownProps.error && ownProps.error.message
  }
}

export interface DispatchProps {
  navigateToThread: (id: string, name: string) => void,
  retry: (inviteId: string, key: string) => void,
  dismiss: (inviteId: string) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    navigateToThread: (id: string, name: string) => {dispatch(UIActions.navigateToThreadRequest(id, name))},
    retry: (inviteId: string, key: string) => {dispatch(ThreadsActions.acceptExternalInviteRequest(inviteId, key))},
    dismiss: (inviteId: string) => {dispatch(ThreadsActions.acceptExternalInviteDismiss(inviteId))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingThread)
