## These tags are used in web.test

You can tell cucumber to only run tests with or without a certain tag, check the web.test/README.md

### error handling
- @no\_errors              - finishes trainer without making errors
- @errors                  - finishes trainer and makes errors
- @correct\_errors         - after finishing the trainer, it goes into the purge error flow
- @alternative\_solution   - uses the alternative solution in a textbox (which can be found in the markup)
- @no\_purge               - checks that there is no purge option on the end screen
- @typo                    - user makes a typo which should not count as a mistake

### paying user or lead
- @content\_unlocked       - switches to being a paying customer which is also known as 'unlocked content'
- @content\_locked         - checks that - when NOT logged in, the user sees a 'get access' button on the lesson-end-screen and no other buttons

### misc
- @progress\_bar           - checks that the progress bar shows the correct numbers
- @submit\_hint            - checks that the user sees a hint on how to submit when spending too much time on a gap without interaction
- @info\_texts             - checks that the info texts work
- @cursor\_position        - checks that the cursor is placed at the right position after the user typed an error
- @translation\_visibility - checks that the translations are shown as expected and/or can be toggled
- @formatting\_chars       - checks that neither DL nor LL text contain * " (( { < > } ))
- @keyboard\_shortcuts     - tell the text to use the keyboard shortcuts to finish a trainer
- @hint                    - check that the 'show hint' and 'show solution' buttons work
- @button\_feedback\_color - check that an option button changes to the appropriate color when clicked

## end page
- @localized\_message      - checks that the lesson end page contains a localized feedback message containing also the display name
- @next\_items             - after a review, clicks the next button to do the next review
- @feedback\_message       - tests that after a review, the user sees the correct feedback message
- @feedback\_message\_type - tests that after answering an item in the listening trainer, the bottom bar feedback message type (positive/negative) is correct
- @scoring                 - checks that the correct score is shown on the end page

## test importance
- @smoke\_test             - the scenario will run as part of the smoke test
- @sanity\_test            - the scenario will run as part of the sanity test
- @failing                 - to mark currently failing tests. they will not be included in any test run
