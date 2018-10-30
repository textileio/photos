import React from 'react'
import { View, Text, TextStyle, ViewStyle, Dimensions } from 'react-native'

import Logo from '../SB/components/Logo'
import ContactModal from '../SB/views/UserProfile/ContactModal'
import Colors from '../Themes/Colors'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#FAFCFE',
  padding: 11
}

const TEXT: TextStyle = {
  fontFamily: 'BentonSans',
  fontSize: 18,
  lineHeight: 22,
  textAlign: 'center'
}

const LINK: TextStyle = {
  ...TEXT,
  color: Colors.brandBlue
}

const ERROR: TextStyle = {
  ...TEXT,
  color: Colors.brandRed
}

const WIDTH = Dimensions.get('window').width

interface Props {
  message: string
}

interface State {
  showContactModal: boolean
}

export default class FatalErrorView extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = { showContactModal: false }
  }

  contact = () => this.setState({ showContactModal: !this.state.showContactModal })

  render () {
    return (
      <View style={CONTAINER}>
        <Logo>
          <Text style={TEXT}>Oops, something went very wrong!{'\n'}Please <Text style={LINK} onPress={this.contact}>contact us</Text> and let us know:</Text>
        </Logo>
        <Text style={ERROR}>{this.props.message}</Text>
        <ContactModal height={200} width={WIDTH} onClose={this.contact} isVisible={this.state.showContactModal} />
      </View>
    )
  }
}
