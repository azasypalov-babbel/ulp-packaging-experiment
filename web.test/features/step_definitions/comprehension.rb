## comprehension
Then("I open the solution slider") do
  @current_page.show_slide_container
end

Then(/I click (?:on )?the (?:comprehension )?(audio|play|pause|replay) button/) do |type|
  @current_page.click_audio_button(type)
end

Then("I click (on )the comprehension button with the text {string}") do |text|
  @current_page.click_comprehension_button_with_text(text)
end

Then('I should see a sound player with {string} symbol') do |symbol|
  assert @current_page.sound_player_with_symbol? symbol
end

Then('I {should_or_not} see a(n) {string} {string} arrow button') do |should, color, direction|
  if should.value
    assert @current_page.arrow_button_visible?(direction, color)
  else
    assert !@current_page.arrow_button_visible?(direction, color, 2)
  end
end

Then('I {should_or_not} see a sound player tooltip') do |should|
  if should.value
    assert @current_page.tooltip_visible?
  else
    assert !@current_page.tooltip_visible?
  end
end

Then('I {should_or_not} see a(n) {string} sound {string} button') do |should, enabled, direction|
  if should.value
    assert @current_page.small_sound_button_visible?(enabled, direction)
  else
    assert !@current_page.small_sound_button_visible?(enabled, direction, 2)
  end
end

Then('I should see some {word} sound nuggets') do |color|
  assert @current_page.count_sound_nuggets(color) >= 2
end

Then('I should see a title') do
  assert @current_page.title
end

Then('I should see a question') do
  assert @current_page.question
end

Then('I should see at least one correct answer') do
  assert @current_page.correct_answer_count >= 1
end

Then('I should see a description') do
  assert @current_page.description
end

Then('I should see {int} {word} sound nuggets') do |count, color|
  assert count == @current_page.count_sound_nuggets(color)
end

Then('I {should_or_not} see an(y) item text') do |should|
  if should.value
    assert @current_page.count_item_texts.positive?
  else
    assert @current_page.count_item_texts.zero?
  end
end

Then('I should not see the question sheet') do
  assert !@current_page.question_sheet_expanded?(2)
end

When('I click on the sound forward button') do
  @current_page.sound_forward_button.click
end

When('I click on the sound backward button') do
  @current_page.sound_backward_button.click
end

When('I wait until I see the replay button') do
  @current_page.wait_for_replay_button
end

Then("I should see that I am answering question {int} of {int}") do |current, total|
  assert @current_page.currently_on_question?(current, total)
end

Then('I should not see any arrow button') do
  assert !@current_page.up_arrow_visible?(2) && !@current_page.down_arrow_visible?(2)
end
