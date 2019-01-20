import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, ViewStyle, View, ListRenderItemInfo, Text, TextStyle } from 'react-native'

import { RootState } from '../Redux/Types'
import Avatar from '../Components/Avatar'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import { ThreadLikeInfo } from '@textile/react-native-sdk'

const CONTAINER: ViewStyle = {
  backgroundColor: '#FAFCFE'
}

const LIKE_ITEM: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  margin: 11
}

const LIKE_TEXT: TextStyle = {
  fontFamily: 'BentonSans',
  margin: 11
}

interface StateProps {
  likes: ReadonlyArray<{
    peerId: string,
    username: string
  }>
}

class LikesScreen extends React.Component<StateProps & NavigationScreenProps<{}>> {
  // @ts-ignore
  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        {/* tslint:disable-next-line jsx-no-lambda */}
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.goBack() }} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Likes'
    }
  }

  keyExtractor = (item: { peerId: string; username: string }, index: number) => {
    return item.username + index
  }

  renderItem = (info: ListRenderItemInfo<{ peerId: string; username: string }>) => {
    const { peerId, username } = info.item
    return (
      <View style={LIKE_ITEM}>
        <Avatar style={{ width: 55, height: 55 }} peerId={peerId} />
        <Text style={LIKE_TEXT}>{username}</Text>
      </View>
    )
  }

  render () {
    return (
      <FlatList
        style={CONTAINER}
        data={this.props.likes}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  if (!state.photoViewing.viewingPhoto) {
    throw Error('No viewing photo')
  }
  const likes = state.photoViewing.viewingPhoto.likes.map((like) => {
    const username: string = like.username || 'unknown'
    return {
      peerId: like.author_id,
      username
    }
  })
  return {
    likes
  }
}

export default connect(mapStateToProps)(LikesScreen)
