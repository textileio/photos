// @flow
import React from 'react'
import { View, Text, Image, Linking, Dimensions } from 'react-native'
import { Overlay, Icon } from 'react-native-elements'
import Evilicon from 'react-native-vector-icons/EvilIcons'

// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles from './Styles/PairingViewStyle'

class InfoView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { }
  }

  render () {
    return (
      <View style={styles.container}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.2
          }}
        >
          <Image style={{
            flex: 1,
            resizeMode: 'center',
            position: 'absolute',
            bottom: 0
          }} source={require('../Images/backgrounds/TextileBackground.png')} />
          <Overlay
            isVisible
            windowBackgroundColor='rgba(0, 0, 0, .2)'
            width={Dimensions.get('window').width * 0.8}
            height='auto'
          >
            <Text style={{
              alignSelf: 'center',
              fontSize: 24
            }}>Information</Text>
            <View style={{
              flexDirection: 'row',
              marginVertical: 40,
              paddingHorizontal: 20,
              justifyContent: 'space-around'
            }} >
                <Icon
                  reverse
                  name='sc-telegram'
                  type='evilicon'
                  color='#517fa4'
                  onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfVwD37Wh0OpnlXKA')}
                />
                <Icon
                  reverse
                  name='sc-twitter'
                  type='evilicon'
                  color='#517fa4'
                  onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfVwD37Wh0OpnlXKA')}
                />
                <Icon
                  reverse
                  name='envelope'
                  type='evilicon'
                  color='#517fa4'
                  onPress={() => Linking.openURL('mailto:contact@textile.io')}
                />
            </View>
            <Text
              style={{
                padding: 20, textAlign: 'justify'
              }}>
              Thanks for taking part in the Textile Beta. We'd love to hear any thoughts or feedback you can offer. Use one of the links above to reach us on Telegram, Twitter, or via Email.
            </Text>
          </Overlay>
        </View>
      </View>
    )
  }
}

export default InfoView
