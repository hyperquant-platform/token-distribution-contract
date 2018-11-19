# HyperQuant token distribution contract
Contract for distributing tokens across provided addresses.

Implemented with [OpenZeppelin](https://openzeppelin.org/) - [GitHub](https://github.com/OpenZeppelin/zeppelin-solidity)

Compiled with [Truffle](http://truffleframework.com/) - [GitHub](https://github.com/trufflesuite/truffle)

## Setup
Clone project and install dependencies.
```sh
git clone git@github.com:hyperquant-platform/token-distribution-contract.git
npm install
```

## Build
Build contracts via npm script.
```sh
npm run compile
```

## Migrations
Before running migrations edit environment variables in `setenv.sh`.

Setup enviroment and do migrations.

```sh
source setenv.sh
npx truffle migrate --network ropsten
```

## Testing
```sh
npm test
```