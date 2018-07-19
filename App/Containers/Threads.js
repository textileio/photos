import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, FlatList, ScrollView, Text, TouchableOpacity } from 'react-native'
import HeaderButtons from 'react-navigation-header-buttons'
import Icon from 'react-native-vector-icons/Ionicons'
import Toast, {DURATION} from 'react-native-easy-toast'
import Colors from '../Themes/Colors'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import UIActions from '../Redux/UIRedux'

// Styles
import styles from './Styles/ThreadsStyle'

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

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Threads',
      headerRight: (
        <HeaderButtons IconComponent={Icon} OverflowIcon={<Icon name="ios-more" size={23} color="white" />} iconSize={33} color="white">
          <HeaderButtons.Item title="add" iconName="ios-add" onPress={() => { navigation.navigate('AddThread') }} />
        </HeaderButtons>
      ),
    }
  }

  state = {selected: (new Map(): Map<string, boolean>)}

  _keyExtractor = (item, index) => item.id

  _onPressItem = (item) => {
    const { id, name } = item
    this.props.navigation.navigate('ViewThread', { threadId: id, threadName: name })
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
      </View>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.threads.threads
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Threads)
