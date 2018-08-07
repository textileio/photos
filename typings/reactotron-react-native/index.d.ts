declare module "reactotron-react-native" {
  export function trackGlobalErrors(pluginConfig?: any): (tron: Reactotron) => ReactotronPlugin
  export function openInEditor(pluginConfig?: any): (tron: Reactotron) => ReactotronPlugin
  export function asyncStorage(pluginConfig?: any): (tron: Reactotron) => ReactotronPlugin
}
