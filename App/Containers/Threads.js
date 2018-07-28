import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, FlatList, ScrollView, Image, Text, TouchableOpacity } from 'react-native'
import HeaderButtons from 'react-navigation-header-buttons'
import Icon from 'react-native-vector-icons/Ionicons'
import Toast, {DURATION} from 'react-native-easy-toast'
import Colors from '../Themes/Colors'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import UIActions from '../Redux/UIRedux'

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

    const headerLeft = (
      <TouchableOpacity >
        <Image style={navStyles.headerIcon} source={require('../SB/views/ThreadsList/statics/photo.png')} />
      </TouchableOpacity>
    )
    const headerRight = (
      <TouchableOpacity onPress={() => { navigation.navigate('AddThread') }}>
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
    data: state.threads.threads.filter(thread => thread.name !== 'default').map(t => { return {...t, size: state.ipfs.threads[t.id].items.length} }).sort((a, b) => b - a)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Threads)
