import React, { Fragment } from 'react'
import {Dispatch} from 'redux'
import { connect } from 'react-redux'
import {RootAction, RootState} from '../Redux/Types'
import { View, Image, Button, ViewStyle, ImageStyle, Text, TextStyle, TouchableOpacity } from 'react-native'

import Icon from '@textile/react-native-icon'
import ProgressBar from './ProgressBar'
import ThreadsActions, { InboundInvite } from '../Redux/ThreadsRedux'
import UIActions from '../Redux/UIRedux'
import { color as colors } from '../styles'

const CONTAINER: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: 80,
  marginBottom: 10,

  flex: 1,
  marginHorizontal: 22,
  alignSelf: 'center',

  borderBottomColor: colors.grey_5,
  borderBottomWidth: 1
}

const ITEM = {
  marginLeft: 6
}

const LAST_ITEM = {
  width: 68
}

const RETRY = {
  marginHorizontal: 5
}

const BUTTON_TEXT: TextStyle = {
  textAlign: 'right',
  alignSelf: 'flex-end',
  color: colors.action_3
}

const IMAGE: ImageStyle = {
  paddingTop: 8,
  width: 54,
  height: 54
}

const STACK: ViewStyle = {
  ...ITEM,
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignContent: 'stretch'
}

const STATUS: TextStyle = {
  fontFamily: 'Biotif-Regular',
  fontSize: 12,
  color: 'rgb(185, 185, 185)',
  textAlign: 'center',
  marginTop: 6,
  marginBottom: 6
}

const ERROR: TextStyle = {
  ...ITEM,
  ...STATUS,
  textAlign: 'left',
  flex: 1
}

const SUCCESS: TextStyle = {
  ...ITEM,
  ...STATUS,
  flex: 1
}

class ProcessingThread extends React.Component<InboundInvite & DispatchProps & StateProps> {
  dismiss(inviteId: string) {
    return () => {
      this.props.dismiss(inviteId)
    }
  }
  retry(inviteId: string, key: string, type: string, threadName?: string, inviter?: string) {
    if (type === 'external') {
      return () => {
        this.props.retry(inviteId, key, threadName, inviter)
      }
    } else {
      return () => {
        this.props.retryInternal(inviteId, threadName)
      }
    }
  }
  view(inviteId: string, threadId: string, name: string) {
    return () => {
      this.props.dismiss(inviteId)
      this.props.navigateToThread(threadId, name)
    }
  }

  getImage() {

    return (
      <View
        style={IMAGE}
      >
        <Icon
          style={{ fontSize: 36, lineHeight: 36, textAlign: 'center' }}
          name={'time'}
          size={36}
          color={colors.grey_5}
        />
      </View>
    )
  }

  getMessage(stage: string, threadName?: string) {
    const name = threadName || 'new group'
    switch (stage) {
      case 'complete':
        return`'Successfully joined' ${name}`
      case 'joining':
        const body = stage[0].toUpperCase() + stage.substr(1).toLowerCase()
        return`${body} ${name}`
      case 'scanning':
      default:
        return`Collecting ${name} history...`

    }
  }

  render() {
    const props = this.props
    const dismiss = this.dismiss(this.props.inviteId)
    const retry = this.retry(this.props.inviteId, this.props.inviteKey, this.props.type, this.props.name, this.props.inviter)

    const errorMessage = props.errorMessage
    const message = this.getMessage(props.stage, props.name)

    let content: JSX.Element
    if (errorMessage) {
      content = (
        <Fragment>
          <Text style={ERROR}>{`Error: ${errorMessage}`}</Text>
          <TouchableOpacity activeOpacity={0.9} onPress={retry} style={RETRY}><Text style={BUTTON_TEXT}>Retry</Text></TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} onPress={dismiss} style={RETRY}><Text style={BUTTON_TEXT}>Cancel</Text></TouchableOpacity>
        </Fragment>
      )
    } else if (props.stage === 'complete') {
      content = (
        <Fragment>
          <Text style={SUCCESS}>{message}</Text>
          <TouchableOpacity activeOpacity={0.9} onPress={dismiss} style={LAST_ITEM}><Text style={BUTTON_TEXT}>Hide</Text></TouchableOpacity>
        </Fragment>
      )
    } else if (props.stage === 'joining')  {
      content = (
        <Fragment>
          <View style={STACK}>
            <Text style={STATUS} />
            <ProgressBar progress={0.40} lineColor={colors.action_3}/>
            <Text style={STATUS}>{message}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={dismiss} style={LAST_ITEM}><Text style={BUTTON_TEXT}>Hide</Text></TouchableOpacity>
        </Fragment>
      )
    } else {
      content = (
        <Fragment>
          <View style={STACK}>
            <Text style={STATUS} />
            <ProgressBar progress={0.90} lineColor={colors.action_3}/>
            <Text style={STATUS}>{message}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={dismiss} style={LAST_ITEM}><Text style={BUTTON_TEXT}>Hide</Text></TouchableOpacity>
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
  retry: (inviteId: string, key: string, threadName?: string, inviter?: string) => void,
  retryInternal: (inviteId: string, threadName?: string) => void,
  dismiss: (inviteId: string) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    navigateToThread: (id: string, name: string) => {dispatch(UIActions.navigateToThreadRequest(id, name))},
    retry: (inviteId: string, key: string, threadName?: string, inviter?: string) => {dispatch(ThreadsActions.acceptExternalInviteRequest(inviteId, key, threadName, inviter))},
    retryInternal: (inviteId: string, threadName?: string) => {dispatch(ThreadsActions.acceptInviteRequest(inviteId, threadName))},
    dismiss: (inviteId: string) => {dispatch(ThreadsActions.acceptInviteDismiss(inviteId))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingThread)
