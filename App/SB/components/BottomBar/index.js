import React from 'react'
import propTypes from 'prop-types'
import { View, Image } from 'react-native'

import styles from './statics/styles'

const BottomBar = props => {
  const { active } = props

  return (
    <View style={styles.bottomBar}>
      <View style={active === 'threads' && styles.bottomBarIconActive}>
        { active === 'threads' && (
          <Image style={styles.bottomBarIcon} source={require('./statics/icon-threads-active.png')} />
        )}
        { active !== 'threads' && (
          <Image style={styles.bottomBarIcon} source={require('./statics/icon-threads.png')} />
        )}
      </View>
      <View style={active === 'wallet' && styles.bottomBarIconActive}>
        { active === 'wallet' && (
          <Image style={styles.bottomBarIcon} source={require('./statics/icon-wallet.png')} />
        )}
        { active !== 'wallet' && (
          <Image style={styles.bottomBarIcon} source={require('./statics/icon-wallet.png')} />
        )}
      </View>
      <View style={active === 'feed' && styles.bottomBarIconActive}>
        { active === 'feed' && (
          <Image style={styles.bottomBarIcon} source={require('./statics/icon-feed.png')} />
        )}
        { active !== 'feed' && (
          <Image style={styles.bottomBarIcon} source={require('./statics/icon-feed.png')} />
        )}
      </View>
    </View>
  )
}

BottomBar.propTypes = {
  active: propTypes.oneOf(['threads', 'wallet', 'feed'])
}

export default BottomBar
