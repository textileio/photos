import React from 'react'
import {Dispatch} from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View } from 'react-native'

import { Protobufs } from '@textile/react-native-sdk'
import {RootAction} from '../Redux/Types'

import ProcessingImagesActions from '../Redux/ProcessingImagesRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import UIActions from '../Redux/UIRedux'

import ThreadDetailCard from '../SB/components/ThreadDetailCard'

import ProcessingImageCard, { IProcessingImageProps } from './ProcessingImage'
import ProcessingThreadCard from './ProcessingThread'

import styles from './Styles/PhotoStreamStyles'

interface PhotoItem {
  type: string
  photo: Protobufs.IFiles
}
interface ProcessingItem {
  type: string
  id: string
  props: IProcessingImageProps
}

interface ScreenProps {
  items: ReadonlyArray<PhotoItem | ProcessingItem>
  displayThread?: boolean
}

class PhotoStream extends React.Component<ScreenProps & DispatchProps & NavigationScreenProps<{}>> {

  _onCommentSelect = (photo: Protobufs.IFiles, threadId: string) => {
    return () => {
      if (photo.target) {
        this.props.navigateToComments(photo.target, threadId)
      }
    }
  }

  onLikes = (photo: Protobufs.IFiles, threadId: string) => {
    return () => {
      if (photo.target) {
        this.props.navigateToLikes(photo.target, threadId)
      }
    }
  }

  _onRefresh = () => {
    this.props.refreshMessages()
  }

  _keyExtractor = (item: any, index: number) => item.block + '_' + index

  _renderItem = (rowData: any) => {
    const item = rowData.item
    switch (item.type) {
      case 'processingThread': {
        return (
          <ProcessingThreadCard
            {...item.props}
          />
        )
      }
      case 'processingItem': {
        return (
          <ProcessingImageCard
            {...item.props}
            /* tslint:disable-next-line */
            retry={() => {this.props.retryShare(item.block)}}
            /* tslint:disable-next-line */
            cancel={() => {this.props.cancelShare(item.block)}}
          />
        )
      }
      case 'photo': {
        return (
          <ThreadDetailCard
            displayThread={this.props.displayThread}
            item={item}
            /* tslint:disable-next-line */
            onComment={this._onCommentSelect(item.photo, item.threadId)}
            /* tslint:disable-next-line */
            onLikes={this.onLikes(item.photo, item.threadId)}
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
            /* tslint:disable-next-line */
            keyExtractor={this._keyExtractor.bind(this)}
            /* tslint:disable-next-line */
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
  navigateToComments: (photoId: string, threadId: string) => void
  navigateToLikes: (photoId: string, threadId: string) => void
  retryShare: (uuid: string) => void
  cancelShare: (uuid: string) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    refreshMessages: () => { dispatch(TextileEventsActions.refreshMessagesRequest()) },
    navigateToComments: (id: string, threadId: string) => {
      dispatch(UIActions.navigateToCommentsRequest(id, threadId))
    },
    navigateToLikes: (id: string, threadId: string) => {
      dispatch(UIActions.navigateToLikesRequest(id, threadId))
    },
    retryShare: (uuid: string) => { dispatch(ProcessingImagesActions.retry( uuid )) },
    cancelShare: (uuid: string) => { dispatch(ProcessingImagesActions.cancelRequest( uuid )) }
  }
}

export default connect(undefined, mapDispatchToProps)(PhotoStream)
