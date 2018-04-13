// @flow
import React from 'react'
import { View, Text, Image, Linking, Dimensions } from 'react-native'
import { Overlay, Icon } from 'react-native-elements'
import Evilicon from 'react-native-vector-icons/EvilIcons'

// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles, {buttonColor1, buttonColor2, buttonColor3, buttonColor4} from './Styles/InfoViewStyle'

class InfoView extends React.PureComponent {

  static navigationOptions = {
    title: 'Support/Feedback'
  }

  constructor (props) {
    super(props)
    this.state = { }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Thanks for taking part in the Textile Beta. We'd love to hear any thoughts or feedback you can offer. Use one of the links above to reach us on Telegram, Twitter, or via Email.
          </Text>
          <View style={styles.iconsRow} >
            <Icon
              reverse
              name='sc-telegram'
              type='evilicon'
              color={buttonColor1}
              onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfVwD37Wh0OpnlXKA')}
            />
            <Icon
              reverse
              name='sc-twitter'
              type='evilicon'
              color={buttonColor2}
              onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfVwD37Wh0OpnlXKA')}
            />
            <Icon
              reverse
              name='envelope'
              type='evilicon'
              color={buttonColor3}
              onPress={() => Linking.openURL('mailto:contact@textile.io')}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default InfoView
