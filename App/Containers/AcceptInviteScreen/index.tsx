import React, { Fragment } from 'react'
import { Image, Text, ViewStyle, ImageStyle, TextStyle } from 'react-native'
import {
  NavigationScreenProps,
  NavigationScreenProp,
  NavigationRoute,
  NavigationStackScreenOptions,
  SafeAreaView
} from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootAction, RootState } from '../../Redux/Types'
import ThreadsActions from '../../Redux/ThreadsRedux'
import Button from '../../Components/LargeButton'
import Colors from '../../Themes/Colors'
import { TextileHeaderButtons, Item } from '../../Components/HeaderButtons'
import { color } from '../../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: color.screen_primary,
  padding: 11
}

const IMAGE: ImageStyle = {
  height: '40%',
  resizeMode: 'contain'
}

const TEXT: TextStyle = {
  fontFamily: 'Biotif-Regular',
  fontSize: 18,
  lineHeight: 22,
  textAlign: 'center'
}

const TEXT_EMPHASIS: TextStyle = {
  ...TEXT,
  fontFamily: 'Biotif-Bold'
}

const TEXT_EMPHASIS_1 = {
  ...TEXT_EMPHASIS,
  color: Colors.brandPink
}

const TEXT_EMPHASIS_2 = {
  ...TEXT_EMPHASIS,
  color: Colors.brandYellow
}

interface NavProps {
  id?: string
  key?: string
  name?: string
  inviter?: string
}

interface StateProps {
  valid: boolean
}

interface DispatchProps {
  acceptExternalInvite: () => void
}

class AcceptInviteScreen extends React.Component<
  StateProps & DispatchProps & NavigationScreenProps<NavProps>
> {
  // @ts-ignore
  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        {/* tslint:disable-next-line jsx-no-lambda */}
        <Item
          title="Back"
          iconName="arrow-left"
          onPress={() => {
            navigation.goBack()
          }}
        />
      </TextileHeaderButtons>
    )
    const options: NavigationStackScreenOptions = {
      title: 'Group Invite',
      headerLeft
    }
    return options
  }

  accept = () => {
    this.props.navigation.goBack()
    this.props.acceptExternalInvite()
  }

  render() {
    const threadName =
      this.props.navigation.getParam('name') || 'unknown thread'
    return (
      <SafeAreaView style={CONTAINER}>
        <Image style={IMAGE} source={require('./image.png')} />
        {this.props.valid && (
          <Fragment>
            <Text style={TEXT}>
              You&apos;ve been invited to join{' '}
              <Text style={TEXT_EMPHASIS_2}>{threadName}</Text>!
            </Text>
            <Button text={'Accept Invite'} onPress={this.accept} />
          </Fragment>
        )}
        {!this.props.valid && (
          <Text style={TEXT}>
            There was an issue with the Group invite. Be sure you got this
            invite from a Textile user using the latest version of the Textile
            app.
          </Text>
        )}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: NavigationScreenProps<NavProps>
): StateProps => {
  const inviteId = ownProps.navigation.getParam('id')
  const key = ownProps.navigation.getParam('key')
  const valid = inviteId !== undefined && key !== undefined
  return {
    valid
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: NavigationScreenProps<NavProps>
): DispatchProps => ({
  acceptExternalInvite: () => {
    const inviteId = ownProps.navigation.getParam('id')
    const key = ownProps.navigation.getParam('key')
    const threadName = ownProps.navigation.getParam('name')
    const inviter = ownProps.navigation.getParam('inviter')
    if (inviteId && key) {
      dispatch(
        ThreadsActions.acceptExternalInviteRequest(
          inviteId,
          key,
          threadName,
          inviter
        )
      )
    }
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptInviteScreen)
