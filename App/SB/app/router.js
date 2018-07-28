import React from 'react'
import PropTypes from 'prop-types'
import {Switch, Route, withRouter} from 'react-router-native'

import {
  SignIn,
  SignUp,
  WelcomeMessage,
  OnBoarding,
  ThreadsList,
  ThreadsDetail,
  ThreadsEditName,
  ThreadsEditFriends,
  ThreadCreate,
  ThreadEdit,
  ThreadAddPhoto,
  ThreadPhotoDetail,
  WalletList,
  WalletListSelected,
  PhotoDetail,
  UserProfile
} from '../views'

const App = props => {
  const { history } = props

  return (
    <Switch>
      {/*<Route render={() => <WelcomeMessage/>}/>*/}
      {/*<Route render={() => <OnBoarding onSubmit={() => history.push('/signUp')}/>} />}/>*/}
      {/*<Route render={() => <SignIn/>}/>*/}
      {/*<Route render={() => <SignUp/>}/>*/}
      {/*<Route render={() => <ThreadsList />}/>*/}
      {/*<Route render={() => <ThreadsDetail />}/>*/}
      {/*<Route render={() => <ThreadsEditName />}/>*/}
      {/*<Route render={() => <ThreadsEditFriends />}/>*/}
      {/*<Route render={() => <ThreadCreate />}/>*/}
      {/*<Route render={() => <ThreadEdit />}/>*/}
      {/*<Route render={() => <ThreadAddPhoto />}/>*/}
      {/*<Route render={() => <ThreadPhotoDetail />}/>*/}
      {/*<Route render={() => <WalletList />}/>*/}
      {/*<Route render={() => <WalletListSelected />}/>*/}
      <Route render={() => <PhotoDetail />}/>
      {/*<Route render={() => <UserProfile />}/>*/}
    </Switch>
  )
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

export default withRouter(App)
