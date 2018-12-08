import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { KeyboardAvoidingView, Image, Text, ViewStyle, ImageStyle, TextStyle, View } from 'react-native'
import { NavigationScreenProps, NavigationScreenProp, NavigationRoute } from 'react-navigation'

import Button from '../Components/Button'
import * as s from '../Themes/Constants'
import { RootAction, RootState } from '../Redux/Types'
import UIActions from '../Redux/UIRedux'
import { SharedImage } from '../Models/TextileTypes'
import Icon from '../Components/Icon'
import Avatar from '../Components/AvatarNew'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  paddingHorizontal: s.MARGIN_STANDARD,
  backgroundColor: s.COLOR_BACKGROUND_PRIMARY
}

const PLACEHOLDER: TextStyle = {
  width: 120,
  height: 120,
  marginBottom: s.ITEM_SPACING_LARGE
}

const IMAGE: ImageStyle = {
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: s.ITEM_SPACING_LARGE
}

const ITEM: ViewStyle = {
  marginBottom: s.ITEM_SPACING_LARGE
}

const TITLE: TextStyle = {
  ...ITEM,
  ...s.H2
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...s.H1
}

const TEXT: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR,
  fontSize: s.FONT_SIZE_MEDIUM,
  color: s.COLOR_FONT_DARK_ON_LIGHT_DARK
}

const LABEL: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR
}

const LINK: TextStyle = {
  fontFamily: s.FONT_FAMILY_REGULAR,
  fontSize: s.FONT_SIZE_REGULAR,
  color: s.COLOR_GREY_MEDIUM,
  textDecorationLine: 'underline',
  textAlign: 'center'
}

interface NavigationParams {
  cancel: () => void
}

interface OwnProps {
  onSuccess?: () => void
  navigation?: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
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

type Props = OwnProps & StateProps & DispatchProps

class SetAvatar extends React.Component<Props> {

  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: '',
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <Item
            title='Back'
            iconName='arrow-left'
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

  componentDidMount () {
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
    if (this.props.onSuccess) {
      this.props.onSuccess()
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

  renderImage () {
    if (this.props.data) {
      const source = { uri: 'data:image/jpeg;base64,' + this.props.data }
      return <Image style={IMAGE} source={source} />
    } else if (this.props.accountHasAvatar) {
      return <Avatar style={IMAGE} />
    } else {
      return <Icon style={PLACEHOLDER} name={'question-circle'} size={120} color={s.COLOR_GREY_LIGHT} />
    }
  }

  render () {
    const action = this.props.image ? this.submit : this.choosePhoto
    return (
      <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
          <View>
            {this.renderImage()}
            <Text style={TITLE}>Your Avatar</Text>
            <Text style={SUBTITLE}>It will be shown along with your display name.</Text>
            <Button
              text={this.props.buttonText}
              onPress={action}
              style={ITEM}
            />
            <Text style={[LINK, { opacity: this.props.displaySubButton ? 1 : 0 }]} onPress={this.props.displayPhotoChooser}>Choose Another</Text>
          </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  buttonText: state.ui.chosenProfilePhoto.image ? 'Save' : 'Choose Photo',
  displaySubButton: state.ui.chosenProfilePhoto.image !== undefined,
  image: state.ui.chosenProfilePhoto.image,
  data: state.ui.chosenProfilePhoto.data,
  accountHasAvatar: state.account.profile.value ? state.account.profile.value.avatar_uri !== undefined : false
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  displayPhotoChooser: () => dispatch(UIActions.chooseProfilePhotoRequest()),
  submitAvatar: (image: SharedImage) => dispatch(UIActions.updateProfilePicture(image)),
  cancel: () => dispatch(UIActions.cancelProfileUpdate())
})

export default connect(mapStateToProps, mapDispatchToProps)(SetAvatar)
