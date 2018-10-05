import React from 'react'
import {Dispatch} from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View } from 'react-native'

import {Photo, PhotoId} from '../Models/TextileTypes'
import {RootAction} from '../Redux/Types'

import ProcessingImagesActions from '../Redux/ProcessingImagesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'

import ThreadDetailCard from '../SB/components/ThreadDetailCard'

import ProcessingImageCard, { IProcessingImageProps } from './ProcessingImage'

import styles from './Styles/PhotoStreamStyles'

interface PhotoItem {
  type: string
  photo: Photo
}
interface ProcessingItem {
  type: string
  id: string
  props: IProcessingImageProps
}

interface ScreenProps {
  items: ReadonlyArray<PhotoItem | ProcessingItem>
}

class PhotoStream extends React.Component<ScreenProps & DispatchProps & NavigationScreenProps<{}>> {

  _onPhotoSelect = (photo: Photo) => {
    return () => {
      this.props.navigateToComments(photo.id as PhotoId)
    }
  }

  onLikes = (photo: Photo) => {
    return () => {
      this.props.navigateToLikes(photo.id as PhotoId)
    }
  }

  _onRefresh = () => {
    this.props.refreshMessages()
  }

  _keyExtractor = (item: any, index: number) => item.id + '_' + index

  _renderItem = ( rowData: any) => {
    const item = rowData.item
    switch (item.type) {
      case 'processingItem': {
        return <ProcessingImageCard
          {...item.props}
          retry={() => { this.props.retryShare(item.id) }}
          cancel={() => { this.props.cancelShare(item.id) }}
        />
      }
      case 'photo': {
        return (
          <ThreadDetailCard
            photo={item.photo}
            onComment={this._onPhotoSelect(item.photo)}
            onLikes={this.onLikes(item.photo)}
            recentCommentsCount={2}
            maxLinesPerComment={1}
          />
        )
      }
      default: {
        return (<View />)
      }
    }
  }

  render () {
    return (
      <View style={styles.threadDetail} >
        <View style={styles.imageList}>
          <FlatList
            data={this.props.items}
            keyExtractor={this._keyExtractor.bind(this)}
            renderItem={this._renderItem.bind(this)}
            refreshing={false}
            onRefresh={this._onRefresh}
          />
        </View>
      </View>
    )
  }
}

interface DispatchProps {
  refreshMessages: () => void
  navigateToComments: (photoId: PhotoId) => void
  navigateToLikes: (photoId: PhotoId) => void
  retryShare: (uuid: string) => void
  cancelShare: (uuid: string) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    refreshMessages: () => { dispatch(TextileNodeActions.refreshMessagesRequest()) },
    navigateToComments: (id: PhotoId) => {
      dispatch(UIActions.navigateToCommentsRequest(id))
    },
    navigateToLikes: (id: PhotoId) => {
      dispatch(UIActions.navigateToLikesRequest(id))
    },
    retryShare: (uuid: string) => { dispatch(ProcessingImagesActions.retry( uuid )) },
    cancelShare: (uuid: string) => { dispatch(ProcessingImagesActions.cancelRequest( uuid )) }
  }
}

export default connect(undefined, mapDispatchToProps)(PhotoStream)
