import React from 'react'
import { connect } from 'react-redux'
import { View, Text, FlatList, Clipboard, Share } from 'react-native'
import moment from 'moment'

import { TextileHeaderButtons, Item as TextileItem } from '../../../Components/HeaderButtons'

import styles from './statics/styles'
import { NavigationActions } from 'react-navigation'

class DeviceLogs extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: '',
      headerLeft: (
        <TextileHeaderButtons left>
          <TextileItem title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <TextileHeaderButtons right>
          <TextileItem title='Share' onPress={params.share} />
          <TextileItem title='Copy' onPress={params.copy} />
        </TextileHeaderButtons>
      )
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      copy: () => { this._copy() },
      share: () => { this._share() }
    })
  }

  _copy () {
    const stringified = this.props.logs.map((item) => {
      return [
        moment(item.time).format('LTS'),
        item.event,
        item.message,
        item.error
      ].join(', \t')
    }).join(' \n')
    Clipboard.setString(stringified)
  }

  _share () {
    const stringified = "```\n" + this.props.logs.slice(0,60).map((item) => {
      return [
        moment(item.time).format('LTS'),
        item.event,
        item.message,
        item.error
      ].join(', \t')
    }).join(' \n') + "\n```"
    Share.share({title: '', message: stringified})
  }

  renderHeader () {
    return (
      <View style={styles.headerRow}>
        <View style={styles.timeCell} >
          <Text style={styles.header}>Time</Text>
        </View>
        <View style={styles.cell} >
          <Text style={styles.header}>Event</Text>
        </View>
        <View style={styles.messageCell} >
          <Text style={styles.header}>Message</Text>
        </View>
      </View>
    )
  }

  renderRow ({ item }) {
    return (
      <View style={styles.row}>
        <View style={styles.timeCell} >
          <Text style={[item.error && styles.failure, styles.item]}>{moment(item.time).format('LTS')}</Text>
        </View>
        <View style={styles.cell} >
          <Text style={styles.item}>{item.event}</Text>
        </View>
        <View style={styles.messageCell} >
          <Text style={styles.item}>{item.message}</Text>
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {this.renderHeader()}
          <FlatList
            data={this.props.logs}
            renderItem={this.renderRow}
            numColumns={1}
            keyExtractor={(item, index) => index.toString() + item.time}
            initialNumToRender={100}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    logs: state.deviceLogs.logs
  }
}

const mapDispatchToProps = dispatch => {
  return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceLogs)
