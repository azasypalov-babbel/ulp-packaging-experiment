# Automated User Acceptance Tests (UATs)

#### This document has the following content

- [Environment Setup](#environment-setup)
- [How to run the tests](#running-the-tests)
- [Our CI Integration](#ci-integration)
  - [Updating Knapsack Reports](#updating-knapsack-reports)
- [Information about the tests](#our-tests)

# Environment Setup

1. Install a ruby version manager: [rvm](https://rvm.io/) or [rbenv](https://github.com/rbenv/rbenv).

2. Use the ruby version manager to install our ruby version:

```bash
rvm install 2.7.5
```
or
```bash
rbenv install 2.7.5
```

3. Install the bundler gem

```bash
gem install bundler
```

4. Tell bundler to use https for github access

```bash
bundle config --global github.https true
git config --global url."https://github.com".insteadOf git://github.com
```

5. Install all of the required gems defined in the Gemfile:

```bash
bundle install
```

6. Install chromedriver
- Via direct download from the [chromedriver homepage](http://chromedriver.chromium.org/downloads)
  - Make sure that you are getting the right version (must match your Chrome browser's version)
  - Unzip the downloaded file and place it in your path, for example into `/usr/local/bin`
  - Remove all other chromedrivers in your path - if there are any
  - Try to run it in your console `chromedriver --version`
  - This will trigger a one time security warning from iOS
  - You have to allow the downloaded file to be executed here: System Preferences -> Security & Privacy -> General tab -> Allow apps downloaded from: ...

- Via [homebrew-cask](https://github.com/Homebrew/homebrew-cask).
  ```bash
    brew tap caskroom/cask
    brew cask install chromedriver
  ```

7. If you intend to use Firefox, install geckodriver (also available via [direct download](https://github.com/mozilla/geckodriver/releases/))

```bash
brew install geckodriver
```

Note: Installing geckodriver may take a while.

# Running The Tests

### Required Environment Variables

Make a copy of `env.example` called `.env`

In there you can set which `TEST_ENV` which is the address to your lesson-player.spa

### Available Drivers

`DRIVER` variable can be set to the following drivers:

- chrome

### Cucumber Sommands To Start The Tests

Run everything

```bash
bundle exec cucumber
```

Run all features in a folder

```bash
bundle exec cucumber features/review
```

Run all scenarios with tag "web"

```bash
bundle exec cucumber -t @web
```

Run one specific file

```bash
bundle exec cucumber features/lesson/vocabulary-fillin.feature
```

Run only vocabulary.feature and whichever scenario starts in line 20

```bash
bundle exec cucumber features/lesson/vocabulary-fillin.feature:20
```

# CI Integration

- On Github, the test tagged with `@smoke_test` & `@sanity_test` will be automatically run on every push. Additionally, the remaining tests can be executed manually by adding `run_tests` to the commit message. These additional tests also run once each day automatically.
- The tests are run using a full chrome browser.

## Updating Knapsack Reports

We use [Knapsack](https://github.com/ArturT/knapsack) to distribute tests evenly across several nodes in CI. Based on the the timing of each feature file, knapsack tries to distribute the tests between several nodes so that the nodes complete in roughly the same time.
We update these timings manually. We should do this periodically as we add / modify the UI tests.
To do this, first set the environment `KNAPSACK_GENERATE_REPORT` (modify this in the github workflow config)
```
KNAPSACK_GENERATE_REPORT: true
```
Run the full test suite with the `run_tests` commit message.

Collect the output per node and update the respective report file.
EG for "Smoke Tests" run with the `@smoke_test` the output should go into `knapsack_report@smoke_test.json`

Example output from knapsack after a node has successfully completed:
```
Knapsack report was generated. Preview:
{
  "features/interactions/puzzlehelper.feature": 24.095789432525635,
  ...
}
```

Commit the changes and don't forget to disable `KNAPSACK_GENERATE_REPORT` again.

# Our Tests

### Ruby

Our tests are written in Ruby. We follow the Babbel internal Ruby style guide. Run `rubocop` regularly and fix its complaints.

```bash
cd web.test
rubocop .
```

### Directory Structure

- **features**
  - Is split into folders based on tested concepts / entities
  - Contain the .feature files which contain the test scenarios
  - In the scenarios, the steps from the step_definitions are used
- **features/step_definitions**
  - contains a file per page / component
  - each file contains the steps that apply to this page / component
  - steps are kept deliberately short and must contain only
    - some assertion(s)
    - set @current_page if necessary
    - action(s) on the @current_page, preferably doing exactly what is written in the step definition
- **web**
  - The actual implementations
  - contains folders and files based on pages / components
- **features/support**
  - The base page object resides in `features/support/pages`
  - There are also the files that load the test environment `env.rb` and `extended_world.rb`
- **config**
  - contains the config files

### UAT Introduction

- UATs tests try to imitate user behavior and should assume as little as possible about the underlying code
  - Not making assumptions means that testing a button or field in one trainer should imply nothing about the same or a similar looking button or field in another trainer
  - An example for this are the text or choicebutton user interaction areas. They are tested very similarly in many trainers because the test or a user cannot know whether it's the same underlying implementation
- As a general rule of thumb, you can assume that every interactable element on any page that can be clicked, filled in, or hovered over, etc, is being clicked, filled in, hovered over, etc
  - exceptions to this rule are all elements / features deemed too unimportant for slow UATs, and of course, everything overseen by human error
- The tests are usually written like this
  - manually 'play' a trainer
  - try to click every button, every image, every field, make errors, make no errors, purge errors,..
  - transform observations into test scenarios
- The tests are written in human language and should be self explanatory, meaning if one reads a scenario one should have a pretty good idea what is being tested
- The language used to write these tests is called `Gherkin`. Scenarios start with a **Given** step (precondition) and can have **When** steps (actions) and **Then/But** steps (outcomes)
- Tests are stored in `feature` files. Each feature should handle one specific theme / concept / entity
- Within a feature, there are `scenarios`. Each scenario tests a certain aspect of the feature's theme
- Each line in a test scenario is called a `step`. Steps are reused in many scenarios and can contain variables
- The test runner ist called `cucumber`
  - It reads the feature files and loads features with scenarios with steps into memory
  - It then maps the steps to their corresponding step definitions
  - It fills in a step's variables and executes the test code belonging to it
  - It gathers test information like runtime and failing/passing/undefined steps
- A good way to find out what cucumber tests are actually testing, is to read the step definitions. These are grouped by pages and/or components. These pages are pages as seen by the _users_, no matter how they are implemented in the backend
- Once one has read the step definitions, one can read the actual scenarios that use the steps and see how they are used together
- Scenarios may have '@tags' which are keywords to group the tests, they have no impact on the tests themselves

### What The Tests Are Testing

First read the step definitions and some scenarios to get an overview

Our tests run against the lesson-player in `demo mode` which mocks all outside services and uses mock data. It also uses a custom made static start page to be able to get to the different trainers. We need it because we are lacking the babbel homepage as an entry point.

We are _not_ testing

- any audio input or microphone enabled settings
- the lesson-player embedded in or in combination with other parts of the babbel homepage
- actual lesson content
- any backend calls

We are _neither_ doing automated cross-browser testing _nor_ automated checking for visual style issues

We are testing all pages served by the lesson-player.spa
- features/review
- features/trainers
- features/sound-autoplay (= learning tip page)
- microphone settings page (but only to _disable_ the microphone)
- lesson & trainer end pages

We are also testing some broader concepts that span across multiple pages

**end pages**

The information displayed on the lesson and review end page is a bit different. We test that the feedback messages are as they should be, the numbers of points and errors are correct, and the correct buttons to continue from the respective page are shown.

**paywall**

The paywall is the idea of users ending up at a figurative 'wall' where they cannot continue unless they pay. Users need a subscription to access the full content. Subscriptons are per learn language. Based on their subscription status, they see different lesson end pages. Non-subscribers see a call to action (pay) and are redirected to the payment page, while subscribers can correct their errors or continue learning.

**progress bar**

The progress bar shows the user's progress through a lesson or vocabulary review. It shows numbers and color changes to indicate progress.

**purge**

Purge means that a user is correcting errors they made during a lesson or review.

- Users can purge their errors for as many rounds as it takes until all errors have been corrected
- Of course, they can also choose to stop purging at any time
- There are trainers that can't be purged
- To start purge, there is a correct errors button on the lesson/review end screens, but only for subscribers

Purge in the UATs

- The purge flow is tested in many trainers to cover the availability of the feature, that is if it can be started and finished. The content of the purge session is tested by unit tests of the purge formatters.
- Some trainers don't offer purge. This is also tested. Read features/purge/purge.feature for more information

**whole lesson**

The features in this folder are testing that we can go from one trainer to the next like in a lesson on the babbel homepage, and that can make errors in all of them, and purge the errors from all of them (at least those that allow purge).
The lesson end page should then show up correctly, showing the number correct answers and errors collected in all trainers in the lesson.

### Developing

Assume you want to change the implementation of the tests for Vocabulary Write and Card Puzzlehelper. First, you would open the following files:

- features/trainers/card-puzzlehelper.feature
- features/trainers/vocabulary-fillin.feature
- web/trainers/card-puzzlehelper.rb
- web/trainers/vocabulary-fillin.rb

Seeing that card puzzlehelper inherits from TrainerBase, you might want to open this file as well. And then it includes four modules:   PuzzleHelper, InputField, PageCardAny, and TranslationHint which you could also look at. These classes and modules might themselves inherit from other classes and include modules. Here is where you find them:

- TrainerBase: web/trainer.rb
- WebBase: web/web\_base.rb
- Base: features/support/pages/base.rb
- Modules: web/lesson/shared\_modules/
