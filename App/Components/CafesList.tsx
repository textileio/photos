import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FlatList } from 'react-native'
import Config from 'react-native-config'

import { RootState, RootAction } from '../Redux/Types'
import { cafesActions } from '../features/cafes'

import CafeItem from './CafeItem'
import Separator from './Separator'
import { DiscoveredCafes } from '../Services/textile-lb-api'

interface Cafe {
  name: string
  peerId: string
  url: string
  token: string
}

const Cafes = [
  {
    name: 'US-West-1a',
    peerId: '12D3KooWGBW3LfzypK3zgV4QxdPyUm3aEuwBDMKRRpCPm9FrJvar',
    url: 'https://us-west-1a.textile.cafe/',
    token: Config.RN_TEXTILE_CAFE_TOKEN
  },
  {
    name: 'US-West-1c',
    peerId: '12D3KooWQue2dSRqnZTVvikoxorZQ5Qyyug3hV65rYnWYpYsNMRE',
    url: 'https://us-west-1c.textile.cafe',
    token: Config.RN_TEXTILE_CAFE_TOKEN
  },
  {
    name: 'US-East-2a',
    peerId: '12D3KooWERmHT6g4YkrPBTmhfDLjfi8b662vFCfvBXqzcdkPGQn1',
    url: 'https://us-east-2a.textile.cafe',
    token: Config.RN_TEXTILE_CAFE_TOKEN
  },
  {
    name: 'US-East-2b',
    peerId: '12D3KooWLh9Gd4C3knv4XqCyCuaNddfEoSLXgekVJzRyC5vsjv5d',
    url: 'https://us-east-2b.textile.cafe',
    token: Config.RN_TEXTILE_CAFE_TOKEN
  },
  {
    name: 'EU-West-3a',
    peerId: '12D3KooWDhSfXZCBVAK6SNQu7h6mfGCBJtjMS44PW5YA5YCjVmjB',
    url: 'https://eu-west-3a.textile.cafe',
    token: Config.RN_TEXTILE_CAFE_TOKEN
  },
  {
    name: 'EU-West-3b',
    peerId: '12D3KooWBCZEDkZ2VxdNYKLLUACWbXMvW9SpVbbvoFR9CtH4qJv9',
    url: 'https://eu-west-3b.textile.cafe',
    token: Config.RN_TEXTILE_CAFE_TOKEN
  },
  {
    name: 'AP-Southeast-1a',
    peerId: '12D3KooWQ5MR9Ugz9HkVU3fYFbiWbQR4jxKJB66JoSY7nP5ShsqQ',
    url: 'https://ap-southeast-1a.textile.cafe',
    token: Config.RN_TEXTILE_CAFE_TOKEN
  },
  {
    name: 'AP-Southeast-1b',
    peerId: '12D3KooWQ5MR9Ugz9HkVU3fYFbiWbQR4jxKJB66JoSY7nP5ShsqQ',
    url: 'https://ap-southeast-1b.textile.cafe',
    token: Config.RN_TEXTILE_CAFE_TOKEN
  }
]

interface OwnProps {
  selected?: string
  onSelect: (peerId: string, token: string) => void
  alreadyRegistered?: ReadonlyArray<string>
  ListHeaderComponent?: JSX.Element
  disabled?: boolean
}

interface StateProps {
  recommended?: DiscoveredCafes
}

interface DispatchProps {
  requestRecommendedCafes: () => void
}

type Props = OwnProps & StateProps & DispatchProps

class CafesList extends Component<Props> {
  render() {
    // Filter cafes as not to include those the user is already registered with
    // not used during onboarding
    const filteredCafes = Cafes.filter(cafe => {
      if (this.props.alreadyRegistered) {
        if (this.props.alreadyRegistered.indexOf(cafe.peerId) !== -1) {
          return false
        }
      }
      return true
    })
    return (
      <FlatList
        data={filteredCafes}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={() => <Separator />}
        ListHeaderComponent={
          this.props.ListHeaderComponent
            ? this.props.ListHeaderComponent
            : undefined
        }
      />
    )
  }

  componentDidMount() {
    this.props.requestRecommendedCafes()
  }

  isRecommended(peerId: string) {
    if (this.props.recommended) {
      if (this.props.recommended.primary) {
        if (peerId === this.props.recommended.primary.peer) {
          return true
        }
      }
      if (this.props.recommended.secondary) {
        if (peerId === this.props.recommended.secondary.peer) {
          return true
        }
      }
    }
    return false
  }

  _keyExtractor = (item: Cafe) => item.peerId

  _renderItem = ({ item }: { item: Cafe }) => (
    <CafeItem
      name={item.name}
      peerId={item.peerId}
      url={item.url}
      token={item.token}
      disabled={this.props.disabled !== undefined ? this.props.disabled : false}
      selected={this.props.selected ? item.url === this.props.selected : false}
      recommended={this.isRecommended(item.peerId)}
      onPressItem={this.props.onSelect}
    />
  )
}

const mapStateToProps = (state: RootState): StateProps => {
  const recommended = state.cafes.recommendedCafesResults.results || undefined
  return {
    recommended
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    requestRecommendedCafes: () =>
      dispatch(cafesActions.getRecommendedCafes.request())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CafesList)
