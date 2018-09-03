import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native'

import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import styles from './statics/styles'

export default class BottomDrawerPhotos extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: true
    }
  }

  render () {
    return (
      <View style={styles.container} >
        <View style={styles.header}>
          <Text style={styles.title}>Share this photo in:</Text>
          <TouchableOpacity style={styles.closeButtonWrapper} onPress={() => {
            this.props.screenProps.onClose()
          }}>
            <Image style={styles.closeIcon} source={require('./statics/icon-cancel.png')} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.listContainer}>
          {this.props.screenProps.threads.map((thread, i) => (
            <TouchableOpacity key={i} onPress={() => {
              this.props.screenProps.selector(i)
            }}>
              <PhotoWithTextBox style={styles.photoElement} photo={this.props.screenProps.thumbs[thread.id]} text={thread.name} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => {
            this.props.screenProps.newThread()
          }}>
            <PhotoBoxEmpty title='Create new thread' />
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}
