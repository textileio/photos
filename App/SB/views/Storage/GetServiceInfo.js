export default function (service) {
  switch (service) {
    case 'autoPinPhotos':
      return {
        title: 'Auto pin new photos',
        subtitle: 'Add all new photos to your wallet',
        details: 'Automatically sync files from your local camera roll to your Textile wallet. '
          + 'This allows you to quickly select photos to share directly from your wallet, '
          + 'cleanup files from your device to save space, and sync to other devices such as your desktop through Textile.'
      }
    // case 'deleteDeviceCopy':
    //   return {
    //     title: 'Delete original copies',
    //     subtitle: 'Remove original from camera roll',
    //     details: 'Deletes the original file from your device storage.',
    //     dependsOn: 'autoPinPhotos'
    //   }
    // case 'storeHighRes':
    //   return {
    //     title: 'Pin full resolution',
    //     subtitle: 'Pin original resolution in your wallet',
    //     details: 'Add the original resolution files to your local wallet.'
    //   }
    case 'enablePhotoBackup':
      return {
        title: 'Enable remote backup',
        subtitle: 'Backup files using IPFS and Textile',
        details: 'Uses a remote Textile IPFS cluster to backup your privately encrypted photos.'
      }
    case 'enableWalletBackup':
      return {
        title: 'Enable Account Recovery',
        subtitle: 'Wallet backup with Textile',
        details: 'In the event you lose, wipe, or destroy your device, this enables full wallet recovery using only your private mnemonic.'
      }
    default:
      return undefined
  }
}
