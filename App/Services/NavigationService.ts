import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationParams
} from 'react-navigation'

let _navigator: NavigationContainerComponent

function setTopLevelNavigator(navigatorRef: NavigationContainerComponent) {
  _navigator = navigatorRef
}

function navigate(routeName: string, params?: NavigationParams) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  )
}

function goBack() {
  _navigator.dispatch(NavigationActions.back())
}

export interface NavigationService {
  setTopLevelNavigator: (navigatorRef: NavigationContainerComponent) => void
  navigate: (routeName: string, params?: NavigationParams) => void
  goBack: () => void
}

// add other navigation functions that you need and export them
export default {
  navigate,
  goBack,
  setTopLevelNavigator
} as NavigationService
