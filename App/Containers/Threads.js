import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../Themes/Colors'
import Avatar from '../Components/Avatar'

// Styles
import styles from './Styles/ThreadsStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.item)
  }

  render () {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>
            {this.props.item.name}
          </Text>
          <Icon name={'ios-arrow-forward'} size={30} color={Colors.steel} />
        </View>
      </TouchableOpacity>
    )
  }
}

class Threads extends React.PureComponent {
  constructor (props) {
    super(props)
    // allows us to pass through the list
    if (this.props.navigation.state.params && this.props.navigation.state.params.thread) {
      this._onPressItem(this.props.navigation.state.params.thread)
    }
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}

    const avatarUrl = params.profile && params.profile.avatar_id ? 'https://cafe.us-east-1.textile.io' + params.profile.avatar_id : undefined
    const username = params.profile && params.profile.username ? params.profile.username : undefined

    const headerLeft = (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Account', {avatarUrl, username})
        }}
      >
        <Avatar width={24} height={24} uri={avatarUrl} defaultSource={require('../SB/views/Settings/statics/main-image.png')}/>
        {/*<Image style={navStyles.headerIcon} source={require('../SB/views/ThreadsList/statics/photo.png')} />*/}
      </TouchableOpacity>
    )
    const headerRight = (
      <TouchableOpacity style={navStyles.moreButtonWrapper} onPress={() => { navigation.navigate('AddThread') }}>
        <Image style={navStyles.headerIcon} source={require('../SB/views/ThreadsList/statics/plus.png')} />
      </TouchableOpacity>
    )
    const headerTitle = (
      <Image style={navStyles.headerLogo} source={require('../SB/views/ThreadsList/statics/logo.png')} />
    )

    return {
      headerLeft,
      headerTitle,
      headerRight
    }
  }

  state = {selected: (new Map(): Map<string, boolean>)}

  componentDidMount () {
    this.props.navigation.setParams({
      profile: this.props.profile
    })
  }

  _keyExtractor = (item, index) => item.id

  _onPressItem = (item) => {
    const { id, name } = item
    this.props.navigation.navigate('ViewThread', { id: id, name: name })
  }

  _renderItem = ({item}) => (
    <MyListItem
      item={item}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
    />
  )

  _onSubmit = () => {
    this.props.navigation.navigate('Comment')
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <FlatList
          ItemSeparatorComponent={() => (<View style={styles.separator} />)}
          style={styles.container}
          data={this.props.data}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.preferences.profile,
    data: state.threads.threads.filter(thread => thread.name !== 'default').map(t => {
      return {
        ...t,
        size: !state.textileNode.threads[t.id] ? 0 : state.textileNode.threads[t.id].items.length
      }}).sort((a, b) => b - a)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Threads)
