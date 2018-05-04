import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, FlatList, ScrollView, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../Themes/Colors'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

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
      icon = this.props.selected ? 'ios-checkbox' : 'ios-checkbox-outline'
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
    // updater functions are preferred for transactional updates
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
    this.props.navigation.navigate('Comment')
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <FlatList
          ItemSeparatorComponent={() => (<View style={styles.separator} />)}
          style={styles.container}
          data={this.props.data}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
        <TouchableOpacity onPress={this._onSubmit}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              {'Next'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: [
      {type: 'thread', id: 'a', title: 'Beta Testers'},
      {type: 'thread', id: 'b', title: 'Family'},
      {type: 'add', id: 'c', title: 'New Thread'}
    ]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Threads)
