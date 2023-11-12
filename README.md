# @web3-snippets

A repository where I archive every web3 codes.

Multi package repository for web3 developers.

Add package to a specific package.

```sh
# pnpm add <pkg> --filter <workspace>
pnpm add pino-pretty --filter @web3-snippets/client
```

## Directory overview

- pkg/blockchain
- pkg/client
- pkg/server

### pkg/blockchain

Solidity and corresponding unit test codes is primary and other web3 materials like IPFS, provider, infra is secondary.

`assets` stores a bunch of json files and types for `EIPs`, `IPFS` metadata, and types generated from `typechain`.

`contracts` keeps Solidity codes.

`scripts` holds utility hooks for controlling contracts and infra.

`tests` has test suites for contracts and docker images.

### pkg/client

Nextjs app with mysql.

- running mysql server with `docker`
- port mapping(host:container) `3307:3306`
- sql exercises from [Programmers](https://school.programmers.co.kr/learn/challenges?tab=sql_practice_kit) and  [W3Schools](https://www.w3schools.com/sql/exercise.asp?filename=exercise_functions1)