import React from 'react'
import PhotosNavigation from '../Navigation/PhotosNavigation'
import PhotosNavigationService from '../Services/PhotosNavigationService'

class TextileManager extends React.PureComponent {


  render () {
    return (
      <PhotosNavigation ref={navRef => { PhotosNavigationService.setTopLevelNavigator(navRef) }} />
    )
  }
}
