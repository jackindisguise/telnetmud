# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.0](https://github.com/jackindisguise/telnetmud/compare/v1.3.0...v1.4.0) (2020-08-20)


### Features

* added combat and movement message categories ([a11d6f4](https://github.com/jackindisguise/telnetmud/commit/a11d6f45457e0f7859307cec6a59854078687cfc))
* added display name to classifications. ([d6b9009](https://github.com/jackindisguise/telnetmud/commit/d6b9009db3224d208ebe93cc3cd625e9d726166a))
* added reverseDirection function to direction package. ([3505766](https://github.com/jackindisguise/telnetmud/commit/3505766c02bc5df8109968af24e57f766a10771f))
* added score command. ([7079d33](https://github.com/jackindisguise/telnetmud/commit/7079d33040688a891df8acd35277070f8a082db4))
* now sends a status report after combat rounds. ([4302b1c](https://github.com/jackindisguise/telnetmud/commit/4302b1ca185f7f019702ce1a36be4e08b18e1db5))
* re-enabled attribute stuff for testing. ([be2d98e](https://github.com/jackindisguise/telnetmud/commit/be2d98ecf612f14497797f5896675b39d15fe219))

## [1.3.0](https://github.com/jackindisguise/telnetmud/compare/v1.2.0...v1.3.0) (2020-08-19)


### Features

* added act() function for sending messages. ([b3caaba](https://github.com/jackindisguise/telnetmud/commit/b3caababcffaa595fedb5af6debdda36cde308da))
* commands now have access to Mob class ([aff0c12](https://github.com/jackindisguise/telnetmud/commit/aff0c126bcefb640788f5d232f1c97c443f3c526))


### Bug Fixes

* combat stopped but you couldn't restart it due to the job lingering. ([7e4666a](https://github.com/jackindisguise/telnetmud/commit/7e4666a0f10b561d4c89eee645222bf0e67ab452))
* combat test was failing due to HP being too low. ([5f6112b](https://github.com/jackindisguise/telnetmud/commit/5f6112b6e2e3500b9763398fe8c07e6c6efb4ab3))
* moved Character definition to dungeon file. ([a3d2dd6](https://github.com/jackindisguise/telnetmud/commit/a3d2dd6c57405dd533308b81ba9a713cfea4a38f))

## [1.2.0](https://github.com/jackindisguise/telnetmud/compare/v1.1.0...v1.2.0) (2020-08-02)


### Features

* added Character object for handling playable character mobs. ([aab4df1](https://github.com/jackindisguise/telnetmud/commit/aab4df14e8adfbcc0b8c6f3ca41f1499cf3fb32e))
* added combat stuff to mob ([0fda4f0](https://github.com/jackindisguise/telnetmud/commit/0fda4f0cb011e3b12c297acda14e3db24e3b65f5))
* adding combat manager ([c4d4de0](https://github.com/jackindisguise/telnetmud/commit/c4d4de05435a9efad6bbf82109051734e56f75a2))
* adding syntax field for commands for later. ([bc7bd6f](https://github.com/jackindisguise/telnetmud/commit/bc7bd6fd475ca397729ed9988236a7777d91333b))
* command functions now encapsulated in a function call. ([fe535ee](https://github.com/jackindisguise/telnetmud/commit/fe535ee1b6fb3de11b99af3c5130fa09abb0ad1d))
* enabled JSON inclusion in TypeScript. ([3bd17f7](https://github.com/jackindisguise/telnetmud/commit/3bd17f782681c4aa5abf72bb104648f8efcf3a16))
* working on adding attributes as a map. ([ef48085](https://github.com/jackindisguise/telnetmud/commit/ef480855670884d5548d2b4a54f7b82699979706))

## [1.1.0](https://github.com/jackindisguise/telnetmud/compare/v1.0.1...v1.1.0) (2020-06-19)


### Features

* added `package.ts` module. ([07b0a05](https://github.com/jackindisguise/telnetmud/commit/07b0a05ef8728830fa7244a61693945831bbc9a0))
* added shortcuts to mob for player functions (for when mobs are PCs) ([47b0803](https://github.com/jackindisguise/telnetmud/commit/47b0803429c09dfd7a53eb5c6b7b21e601776f6a))
* command parameters can now reference each other by name. ([e3ffce9](https://github.com/jackindisguise/telnetmud/commit/e3ffce9eee878350193e26e36eb76985e680de93))

### [1.0.1](https://github.com/jackindisguise/telnetmud/compare/v0.0.0...v1.0.1) (2020-06-19)


### Bug Fixes

* added robust release script to `package.json` ([dd1b2aa](https://github.com/jackindisguise/telnetmud/commit/dd1b2aa3ec0991315390a006cab49db728d41cb2))
* fixed dungeon spec tests. ([bc182bd](https://github.com/jackindisguise/telnetmud/commit/bc182bd437e42127697423f85195704650d55665))

## 0.0.0 (2020-06-19)


### Bug Fixes

* test ([12eddc2](https://github.com/jackindisguise/telnetmud/commit/12eddc2f17ed62ef55ce5e0589e986c924b8383e))
