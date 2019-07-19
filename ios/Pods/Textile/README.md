# ios-textile

[![Made by Textile](https://img.shields.io/badge/made%20by-Textile-informational.svg?style=popout-square)](https://textile.io)
[![Chat on Slack](https://img.shields.io/badge/slack-slack.textile.io-informational.svg?style=popout-square)](https://slack.textile.io)
[![GitHub license](https://img.shields.io/github/license/textileio/ios-textile.svg?style=popout-square)](./LICENSE)
[![CircleCI branch](https://img.shields.io/circleci/project/github/textileio/ios-textile/master.svg?style=popout-square)](https://circleci.com/gh/textileio/ios-textile)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=popout-square)](https://github.com/RichardLitt/standard-readme)
![Platform](https://img.shields.io/badge/platform-ios-lightgrey.svg?style=popout-square)
[![Version](https://img.shields.io/cocoapods/v/Textile.svg?style=popout-square)](https://cocoapods.org/pods/Textile)

> Textile provides encrypted, recoverable, schema-based, and cross-application data storage built on IPFS and libp2p. We like to think of it as a decentralized data wallet with built-in protocols for sharing and recovery, or more simply, an open and programmable iCloud.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

Textile is available through [CocoaPods](https://cocoapods.org). To install
it, simply add the following line to your Podfile:

```ruby
pod 'Textile'
```

## Usage

To learn about Textile usage, please head over to the [Textile documentation](https://docs.textile.io/) and be sure to read the [iOS getting started guide](https://docs.textile.io/develop/clients/ios/).

This repo contains an example project. To run it, clone the repo and install pods. Next, open `Example/Textile.xcworkspace` with Xcode and build and run the `Textile-Example` scheme.

```
git clone https://github.com/textileio/ios-textile.git
cd ios-textile/Example
pod repo update && pod install
open Textile.xcworkspace
```

## Maintainers

[@asutula](https://github.com/asutula)
[@sanderpick](https://github.com/sanderpick)

## Contributing

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2019 Textile
