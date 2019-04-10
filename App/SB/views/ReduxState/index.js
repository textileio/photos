import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Share, FlatList } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import styles from './statics/styles'

class ReduxState extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: '',
      headerLeft: (
        <TextileHeaderButtons left>
          <TextileItem title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
        </TextileHeaderButtons>
      ),
      headerRight: ([
        <TextileHeaderButtons right>
          <TextileItem title='Share' onPress={params.share} />
        </TextileHeaderButtons>
      ])
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      share: () => { this._share() }
    })
  }

  _share () {
    Share.share({ title: '', message: this.props.redux })
  }

  renderRow ({ item }) {
    const text = item && item !== '' ? item : undefined
    return (
      <Text>{text}</Text>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.textLines}
          renderItem={this.renderRow}
          numColumns={1}
          keyExtractor={(item, index) => String(index)}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const redux = JSON.stringify(state, undefined, 2)
  return {
    redux,
    // instead of rendering big blob of text. https://github.com/facebook/react-native/issues/9077
    textLines: redux.match(/[^\r\n]+/g)
  }
}

export default connect(mapStateToProps, undefined)(ReduxState)
