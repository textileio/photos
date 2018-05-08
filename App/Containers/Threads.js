import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, FlatList, ScrollView, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Toast, {DURATION} from 'react-native-easy-toast'
import Colors from '../Themes/Colors'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import UIActions from '../Redux/UIRedux'

// Styles
import styles from './Styles/ThreadsStyle'

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id)
  }

  render () {
    let color
    let icon
    if (this.props.type === 'thread') {
      icon = this.props.selected ? 'ios-checkbox' : 'ios-square-outline'
      color = this.props.selected ? Colors.brandRed : Colors.brandPink
    } else if (this.props.type === 'add') {
      color = Colors.brandPink
      icon = 'ios-add'
    }
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>
            {this.props.title}
          </Text>
          <Icon name={icon} size={30} color={color} />
        </View>
      </TouchableOpacity>
    )
  }
}

class Threads extends React.PureComponent {
  state = {selected: (new Map(): Map<string, boolean>)}

  _keyExtractor = (item, index) => item.id

  _onPressItem = (id: string) => {
    if (id === 'add') {
      this.refs.toast.show('Coming soon!', DURATION.LENGTH_SHORT)
      return
    }
    // update functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected)
      selected.set(id, !selected.get(id)) // toggle
      return {selected}
    })
  }

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
      type={item.type}
    />
  )

  _onSubmit = () => {
    this.props.share(this.props.hash)
    this.props.close()
  }

  render () {
    const disabled = [...this.state.selected.values()].filter(value => value).length === 0
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
        <TouchableOpacity onPress={this._onSubmit} disabled={disabled}>
          <View style={disabled ? styles.buttonDisabled : styles.button}>
            <Text style={styles.buttonText}>
              {'Share'}
            </Text>
          </View>
        </TouchableOpacity>
        <Toast ref='toast' position='top' />
      </View>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: [
      {type: 'thread', id: 'beta', title: 'Beta Testers'},
      {type: 'add', id: 'add', title: 'New Thread'}
    ],
    hash: state.ui.authoringPhotoShare
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    share: (hash) => { dispatch(UIActions.sharePhotoRequest('beta', hash)) },
    close: () => { dispatch(UIActions.cancelAuthoringPhotoShare()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Threads)
