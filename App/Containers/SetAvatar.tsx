import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  KeyboardAvoidingView,
  Image,
  Text,
  ViewStyle,
  ImageStyle,
  TextStyle,
  View,
  TouchableOpacity,
  Insets
} from 'react-native'
import {
  NavigationScreenProps,
  NavigationScreenProp,
  NavigationRoute
} from 'react-navigation'
import Icon from '@textile/react-native-icon'

import { OnboardingChildProps } from './Onboarding/onboarding-container'
import Button from '../Components/LargeButton'
import { RootAction, RootState } from '../Redux/Types'
import { accountActions } from '../features/account'
import { SharedImage } from '../features/group/add-photo/models'
import Avatar from '../Components/Avatar'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import { color, textStyle, spacing, fontFamily } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  paddingHorizontal: spacing._016,
  backgroundColor: color.screen_primary
}

const PLACEHOLDER: TextStyle = {
  width: 120,
  height: 120,
  marginBottom: spacing._016
}

const IMAGE: ImageStyle = {
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: spacing._016
}

const ITEM: ViewStyle = {
  marginBottom: spacing._016
}

const TITLE: TextStyle = {
  ...ITEM,
  ...textStyle.header_l
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...textStyle.body_l
}

const TEXT: TextStyle = textStyle.body_l

const LABEL: TextStyle = {
  fontFamily: fontFamily.regular
}

const BUTTON: ViewStyle = {
  ...ITEM,
  alignSelf: 'center'
}

const HIT_SLOP: Insets = {
  top: spacing._016,
  left: spacing._016,
  bottom: spacing._016,
  right: spacing._016
}

const LINK: TextStyle = {
  ...textStyle.body_m,
  color: color.grey_4,
  textDecorationLine: 'underline',
  textAlign: 'center'
}

interface NavigationParams {
  onSuccess?: () => void
  cancel: () => void
}

interface OwnProps {
  navigation?: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >
}

interface StateProps {
  buttonText: string
  displaySubButton: boolean
  image?: SharedImage
  data?: string
  accountHasAvatar: boolean
}

interface DispatchProps {
  displayPhotoChooser: () => void
  submitAvatar: (sharedImage: SharedImage) => void
  cancel: () => void
}

type Props = OwnProps & StateProps & DispatchProps & OnboardingChildProps

class SetAvatar extends React.Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: '',
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <Item
            title="Back"
            iconName="arrow-left"
            /* tslint:disable-next-line */
            onPress={() => {
              const cancel = navigation.getParam('cancel')
              cancel()
              navigation.goBack()
            }}
          />
        </TextileHeaderButtons>
      )
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false
    }
  }

  componentDidMount() {
    if (this.props.navigation) {
      this.props.navigation.setParams({
        cancel: this.props.cancel
      })
    }
  }

  choosePhoto = () => {
    this.props.displayPhotoChooser()
  }

  submit = () => {
    if (this.props.image) {
      this.props.submitAvatar(this.props.image)
    }
    if (this.props.onComplete) {
      this.props.onComplete()
    }
    if (this.props.navigation) {
      const onSuccess = this.props.navigation.getParam('onSuccess')
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  updateText = (text: string) => {
    this.setState({
      username: text,
      valid: this.valid(text)
    })
  }

  valid = (username?: string) => {
    if (!username) {
      return false
    }
    return username.length > 0
  }

  renderImage() {
    if (this.props.data) {
      const source = { uri: 'data:image/jpeg;base64,' + this.props.data }
      return <Image style={IMAGE} source={source} />
    } else if (this.props.accountHasAvatar) {
      return <Avatar style={IMAGE} self={true} />
    } else {
      return (
        <Icon
          style={PLACEHOLDER}
          name={'question-circle'}
          size={120}
          color={color.grey_5}
        />
      )
    }
  }

  render() {
    const action = this.props.image ? this.submit : this.choosePhoto
    return (
      <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
        <View>
          {this.renderImage()}
          <Text style={TITLE}>Your Avatar</Text>
          <Text style={SUBTITLE}>
            It will be shown along with your display name.
          </Text>
          <Button
            text={this.props.buttonText}
            onPress={action}
            style={BUTTON}
          />
          <TouchableOpacity
            disabled={!this.props.displaySubButton}
            style={{ opacity: this.props.displaySubButton ? 1 : 0 }}
            onPress={this.props.displayPhotoChooser}
            hitSlop={HIT_SLOP}
          >
            <Text style={LINK}>Choose Another</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  buttonText: state.account.chosenProfilePhoto.image ? 'Save' : 'Choose Photo',
  displaySubButton: state.account.chosenProfilePhoto.image !== undefined,
  image: state.account.chosenProfilePhoto.image,
  data: state.account.chosenProfilePhoto.data,
  accountHasAvatar: state.account.profile.value
    ? state.account.profile.value.avatar !== undefined
    : false
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  displayPhotoChooser: () =>
    dispatch(accountActions.chooseProfilePhoto.request()),
  submitAvatar: (image: SharedImage) =>
    dispatch(accountActions.setAvatar.request(image)),
  cancel: () => dispatch(accountActions.cancelProfilePhotoUpdate())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetAvatar)
