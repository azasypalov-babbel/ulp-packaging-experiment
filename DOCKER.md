# Lesson Player Docker Environment

## Purpose
Run e2e tests ([web.test](./web.test)) without configuration.

## Setup
- [install docker engine](https://docs.docker.com/engine/install/)
- [install docker compose](https://docs.docker.com/compose/install/)

## Start

```bash
# run cucumber against specs tagged with @smoke_test
# by using the chrome-docker driver configuration
DRIVER="chrome-docker" CUCUMBER_ARGUMENTS="-t @smoke_test" docker-compose up
```

Alternatively, [.docker/bin/cucumber](.docker/bin/cucumber) can be used to run tests. It starts the docker stack via docker-compose, waits for the tests to finish and stops the docker containers. Exit code will be the equal to the exit code of the `web.test` container.  
To ensure that the containers will not use outdated images from cache, it rebuilds the containers on each run. For more granular control over the stack use the previous variant.

```bash
# run cucumber against tests tagged with @smoke_test
.docker/bin/cucumber -t @smoke_test
```
 
## Stack

Containers as specified in `./docker-compose.yml`


| container | image | description |
|---|---|---|
| lesson-player.spa | [./Dockerfile](./Dockerfile) | node environment - runs `npm start` to spawn the webpack-dev-server |
| web.test | [./web.test/Dockerfile](./web.test/Dockerfile) | ruby environment running `bundle exec cucumber ${CUCUMBER_ARGUMENTS}` from `./web.test`. <br />See [./web.test/docker-entrypoint.sh](./web.test/docker-entrypoint.sh) |
| selenium-hub | [selenium/hub](https://github.com/SeleniumHQ/docker-selenium) | selenium testing grid hub |
| chrome | [selenium/node-chrome-debug](https://github.com/SeleniumHQ/docker-selenium) | selenium testing grid node with chrome and VNC |



### Environment Variables

| variable | description | default |
|---|----|:---|
| CUCUMBER_ARGUMENTS | cucumber filter argument. Can also contain list of files or feature uris (eg. `features/scenario_a.feature:15`).| -t @smoke_test |
| DRIVER | Driver configuration to use from [./web.test/config/config.yml](./web.test/config/config.yml) | chrome-docker |


## Debugging

### VNC

The chrome container provides vnc access via [vnc://:secret@127.0.0.1:5900](vnc://:secret@127.0.0.1:5900). 

