# lesson-player.spa (b4)

Lesson Player SPA which includes the trainers source files for Babbel's learning content.

## Requirements

- node 14.15
- npm 6.x

## Setup Github Packages

Set up Github Packages https://doc.babbel.com/lessonnine/guides.doc/tooling/github-packages.html

## Setup

Install dependencies, please run:

```bash
npm install
```

### Environments

This project supports 5 separate environments.

| Environment         | Platform | Location                                |
|---------------------|----------|-----------------------------------------|
| development (local) | Web      | localhost:3000                          |
| Production          | Web      | my.babbel.com                           |
| Staging             | Web      | my.babbel.cn                            |
| CAT Preview         | Web      | cat.babbel.com                          |
| webview             | iOS      | Bundled as part of core.ios application |

For the web platforms, the applications will be found at the following path:

```
/:locale/lesson-player/:learning_language/:lesson_id?learningActivityId=:learning_activity_id&contentReleaseId=:content_release_id
```

## Usage

```
npm run start
```

Your server should now be up and running at http://localhost:3000.

This should take you to the "demo" page where you'll see example lessons based on mocked content.

### Entry Points

lesson-player has 3 entry points:

#### Demo

On `/demo` you get the demo page with a list of all the available trainers.

#### Review

On `/review` you access the review page. There are two different review modes: REVIEW_SEARCH (`/review` or `/review?is_search`) and REVIEW_DUE (`/review?is_search=false`).

#### Lesson

In all other cases you enter the lesson mode.

A lesson and review could be rendered with mocked data (used for testing): `/lesson?is_demo=on` or `/review?is_demo=on`.

To simulate a paying customer, add is_unlocked flag: `/lesson?is_demo=on&is_unlocked=on` or `/review?is_demo=on&is_unlocked=on`.

```
session:
  type: LESSON | REVIEW_SEARCH | REVIEW_DUE
  is_demo: true | false
  is_unlocked: true | false
```

### Consuming Real Content

You can access real content from the staging server by adding your staging credentials to your environment file.

> :eyes:	Remember, it's not safe to have your personal, secrets laying around in plain text. Ask a team mate for the credentials of a mock QA account.

Setup your credentials in a `.env` file:

```bash
BABBEL_EMAIL=someone@babbel.com
BABBEL_PASSWORD=someonespassword
```

You should now be able to copy any lesson URL from staging and access it locally by replacing `my.babbel.cn` with `localhost:3000`.

### Testing

To just run the jest unit tests:

```
npm run test
```

And there is also a watch mode:

```
npm run test:unit:watch
```

> :bulb:	Note the `--` separator to pass arguments to the underlying `jest` command (not to the npm script).

### Storybook

In order to access Storybook for the UI components, run:

```
npm run storybook
```

The interactive development environment powered by [React Storybook](https://github.com/storybooks/storybook) will be available at http://localhost:9001

> :bulb:	Documentation of the latest storybook version can be found online at [doc.babbel.com](https://doc.babbel.com/lessonnine/lesson-player.spa/index.html). It is automatically uploaded by Github on every merge to master.

### Developing for Webview

For starting the app for integration with iOS

```
npm run start:webview
```

and visit http://localhost:3000/lesson/static

The default data is specified in `src/demo/data/lesson/default.json`.

You can extend it by setting `DATA_PATH` and pointing it to a JSON file, e.g.

```
DATA_PATH=./src/demo/data/lesson/card-fillin.json npm run start:webview
```

Read more about running the lesson-player as part of the iOS app [here](https://github.com/lessonnine/core.ios/tree/develop/docs/development_workflow#working-with-the-lesson-playerspa)


### Developing for CAT Preview

For running the app in the CAT preview mode, set `CAT_BASE_URL` to the appropriate url, the default is set to https://cat.babbel.com

```
CAT_BASE_URL=http://your-cat-url npm run start
```

> :bulb:	Alternatively you can test your changes by deploying your commit on the [deploy app](https://deploy.babbel.com) and go through a lesson on https://cat.babbel.com
Do not forget to reverse the commit once you are done testing.

### Analyze webpack bundle

The [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) is configured and runs, with `BUNDLE_STATS=1` set.

This works when running locally

```
BUNDLE_STATS=1 npm start
```
as well as for creating builds, e.g.

```
BUNDLE_STATS=1 npm run build
```

## TS Migration Script

The migrate-file script is designed to help with migrating individual files from js to ts.
For details about the migration process see [here](../README.md#typescript-a-process).

Usage:

```bash
npm run migrate-file -- path/to/file.js
```

For VSCode users, consider creating a task in `.vscode/tasks.json`.
When run, this will execute the migration script on the current file.

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Migrate current file to TS",
      "type": "shell",
      "command": "npm run migrate-file -- ${relativeFile}",
      "options": {
        "cwd": "b4"
      }
    }
  ]
}
```
## Contributing

### Adding JSON Assets

For JSON assets we always use camel cased keys. If your data is in some other format please convert it before committing it.

```bash
# camelize keys in demo json data
./scripts/camelizeJsonAssets.js demo/**/*.json
```
