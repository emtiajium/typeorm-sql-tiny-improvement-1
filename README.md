[![CI](https://github.com/emtiajium/typeorm-sql-tiny-improvement-1/actions/workflows/ci.yml/badge.svg)](https://github.com/emtiajium/typeorm-sql-tiny-improvement-1/actions/workflows/ci.yml)

# How to Run

###### Prerequisites

➜ Install Node 14 LTS using [nvm](https://github.com/nvm-sh/nvm)

➜ Install [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/)

###### Clone the repo and install all dependencies

➜ `git clone git@github.com:emtiajium/typeorm-sql-tiny-improvement-1.git`

➜ `cd typeorm-sql-tiny-improvement-1`

➜ `npm install`

###### Run the backing services

➜ `docker-compose up -d`

###### Create the configuration

➜ `npm run create:env`

###### Synchronize model changes into the database

➜ `npm run migration:run`

###### Run the tests

➜ `npm run test`

###### Start the development environment

➜ `npm run start:dev`

## Change Logs

-   `0.0.1`: --- ---
