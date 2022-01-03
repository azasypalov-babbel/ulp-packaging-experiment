############### STEPS ON THE TRAINER PAGES ###############

Then("I am on a {string} trainer page") do |trainer|
  classname = "Pages::#{trainer}Trainer"
  @current_page = Object.const_get(classname).new
  assert @current_page.page_detected?
end

When("I complete/finish the trainer with {int} mistake(s)") do |number_of_mistakes|
  @current_page.finish_trainer(number_of_mistakes)
end

When("I click on the title") do
  @current_page.click_on_title
end

### solve single questions correctly or incorrectly
When(/^I click (on )?(the|a) correct (button|answer|card|solution)$/) do |_, _, _|
  @current_page.fill_in_correct_answer
end

When(/^I click (on )?(the|a) wrong (button|answer|card|solution)$/) do |_, _, _|
  @current_page.fill_in_incorrect_answer
end

When(/^I click (on )?(the|a) alternative (button|answer|card|solution)$/) do |_, _, _|
  @current_page.fill_in_alternative_answer
end

When("I enter the/a correct answer/solution") do
  @current_page.fill_in_correct_answer
end

When("I enter an incorrect answer/solution") do
  @current_page.fill_in_incorrect_answer
end

When(/^I enter (the|a) correct (answer|solution) using the puzzlehelper buttons$/) do |_, _|
  @current_page.fill_in_correct_answer_with_puzzlehelper
end

When(/^I enter (the|an) incorrect (answer|solution) using the puzzlehelper buttons$/) do |_, _|
  @current_page.fill_in_incorrect_answer_with_puzzlehelper
end

When("I enter {string} into the gap") do |string|
  @current_page.fill_in_text(string)
end

When(/^I enter "([^"]+)" using the puzzlehelper buttons$/) do |text|
  @current_page.fill_in_text_with_puzzlehelper(text)
end

When("I enter the/an alternative answer/solution") do
  @current_page.fill_in_alternative_answer
end

Then(/^I should see that the "([^"]+)" puzzlehelper buttons? (are|is) (enabled|disabled)$/) do |string, _, status|
  assert @current_page.puzzlehelper_buttons_correct_status_for?(string, status)
end

Then("I see {string} in the gap") do |expected_text|
  assert @current_page.text_in_gap_equals?(expected_text)
end

Then("the solved item's full text is {string}") do |expected_text|
  assert @current_page.solved_item_full_text_equals?(expected_text)
end

## dialog
When("I click on the latest dialog row") do
  @current_page.dialog_rows.last.click
end

Then("the current speaker image is for {string}") do |expected_role|
  last_shown_speaker = @current_page.speaker_avatars.last
  assert last_shown_speaker.attribute('data-selector').match? expected_role
end

Then("the current dialog text is ...") do
  assert @current_page.dialog_rows.last.text == "..."
end

Then("I should see a solved dialog item with the text {string}") do |expected_text|
  assert(@current_page.dialog_rows.map(&:text).any? { |x| x.match(expected_text) })
end

## wordorder
When("I press the {string} wordorder button") do |word|
  @current_page.get_enabled_wordorderbutton(word).click
end

Then("I see (that )the {string} wordorder button is enabled") do |word|
  assert @current_page.get_enabled_wordorderbutton(word)
end

Then("I see (that )the {string} wordorder button is disabled") do |word|
  assert @current_page.get_disabled_wordorderbutton(word)
end

Then("I (should )see that the wordorder gap is( still) active") do
  assert @current_page.active_gap_exists?
end

Then("I (should )see that the wordorder gap is not active") do
  assert @current_page.gap_exists?
  assert !@current_page.active_gap_exists?
end

# continue button
Then("I wait/patiently wait/patiently for the/a continue button") do
  assert @current_page.general_continue_button_present? 40
end

Then("I {should_or_not} see a continue button") do |should|
  if should.value
    assert @current_page.general_continue_button_present?
  else
    assert !@current_page.general_continue_button_present?(2)
  end
end

When("I click (on )the (trainer end )continue button") do
  @current_page.general_continue_button.click
end

# other actions
When("I click (on )the done button") do
  @current_page.click_on_done_button
end

When("I click (on )delete {int} times") do |count|
  @current_page.click_on_delete_button(count)
end

Then("I should see a solved item with the text {string}") do |expected_text|
  assert @current_page.any_item_visible_with_text?(expected_text)
end

Then("I click on the skip trainer {word} button") do |direction|
  raise unless %w(forward backward).include? direction

  @current_page.skip_trainer direction
end

# choicebuttons
pattern = /^I should see (at least|exactly) (\d) (correct|incorrect|alternative) answers?$/
Then(pattern) do |comparison, expected_count, answer_type|
  log answer_type
  case comparison
  when "at least"
    assert @current_page.count_choices(answer_type) >= expected_count.to_i
  when "exactly"
    assert @current_page.count_choices(answer_type) == expected_count.to_i
  else
    raise "unknown comparison type"
  end
end

Then("I should see that the button with the correct answer turns green when clicked") do
  assert @current_page.choicebutton_color_change_to?(:green)
end

Then("I should see that the button with the incorrect answer turns red when clicked") do
  assert @current_page.choicebutton_color_change_to?(:red)
end

Then("I should see that an unclicked choicebutton has a black border") do
  assert @current_page.choicebutton_color_is?(:black)
end
