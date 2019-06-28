import React, { Component } from 'react'
import { View, FlatList, ListRenderItemInfo, Clipboard } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { NavigationScreenProps, SafeAreaView } from 'react-navigation'
import Textile, { ICafeSession } from '@textile/react-native-sdk'
import moment from 'moment'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import ListItem from '../Components/ListItem'
import RowSeparator from '../Components/RowSeparator'
import { RootAction, RootState } from '../Redux/Types'
import { accountActions, accountSelectors } from '../features/account'

interface Row {
  title: string
  subtile: string
  key: string
}

interface StateProps {
  cafeSession?: ICafeSession
}

interface DispatchProps {
  refreshSession: () => void
}

interface NavProps {
  cafeSessionId: string
  refreshSession: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

class CafeSession extends Component<Props> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const goBack = () => navigation.goBack()
    const refreshSession = navigation.getParam('refreshSession')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )

    const headerRight = (
      <TextileHeaderButtons>
        <Item title="Refresh" iconName="refresh-ccw" onPress={refreshSession} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Session',
      headerRight
    }
  }

  copy = (content: string) => {
    return () => Clipboard.setString(content)
  }

  renderRow = ({ item }: ListRenderItemInfo<Row>) => (
    <ListItem
      title={item.title}
      subtitle={item.subtile}
      onPress={this.copy(item.title)}
    />
  )

  componentDidMount() {
    this.props.navigation.setParams({
      refreshSession: this.props.refreshSession
    })
  }

  render() {
    const session = this.props.cafeSession
    const data: Row[] = []
    if (session) {
      const accessExpDate = Textile.util.timestampToDate(session.exp)
      const refreshExpDate = Textile.util.timestampToDate(session.rexp)
      data.push(
        { title: session.id, subtile: 'id', key: 'id' },
        { title: session.type, subtile: 'type', key: 'type' },
        { title: session.subject, subtile: 'subject', key: 'subject' },
        { title: session.access, subtile: 'access token', key: 'access' },
        {
          title: moment.utc(accessExpDate).format(),
          subtile: 'access token expires',
          key: 'exp'
        },
        { title: session.refresh, subtile: 'refresh token', key: 'refresh' },
        {
          title: moment.utc(refreshExpDate).format(),
          subtile: 'refresh token expires',
          key: 'rexp'
        },
        { title: session.cafe.url, subtile: 'cafe', key: 'cafe' }
      )
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={data}
            renderItem={this.renderRow}
            ItemSeparatorComponent={RowSeparator}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: NavigationScreenProps<NavProps>
): StateProps => ({
  cafeSession: accountSelectors.makeSessionForId(
    ownProps.navigation.getParam('cafeSessionId')
  )(state.account)
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  refreshSession: () => dispatch(accountActions.refreshCafeSessionsRequest())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CafeSession)
