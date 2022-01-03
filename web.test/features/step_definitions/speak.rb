Then(/I(:? can)? see a mic button in "([^"]+)" state/) do |_, expected_state|
  assert @current_page.mic_button_visible_with_state? expected_state
end

Then("I cannot see any tooltip") do
  assert @current_page.tooltip.nil? || !@current_page.tooltip.visible?
end

When(/I wait (\d+.?\d*) seconds?/) do |float|
  sleep float.to_f
end

Then("I can see a tooltip with the text {string}") do |expected_text|
  assert @current_page.tooltip_visible_with_text?(expected_text)
end

When("I click on the mic button") do
  @current_page.mic_button.click
end

When("I click on the speak item") do
  @current_page.current_item_in_bottom_mount_point.click
end

When("I make my way around the speech permissions") do
  @current_page.general_continue_button.click
end

When("I click on the mic toggle button") do
  @current_page.click_on_mic_toggle_button
end

When("I cannot see a mic button") do
  assert @current_page.mic_button(1).nil?
end

When("I can see a mic toggle button") do
  assert @current_page.mic_toggle_button.visible?
end

Then("I should see a Try Again button") do
  assert @current_page.try_again_button.visible?
end

Then("I click on the Try Again button") do
  @current_page.try_again_button.click
end

Then("the speak item should not be highlighted") do
  assert @current_page.feedback?(:none)
end

Then("the speak item text is {string}") do |expected_text|
  assert @current_page.current_item_in_bottom_mount_point.text == expected_text
end

Then(/^the speak item should be highlighted in (red|green)$/) do |expected_color|
  assert @current_page.feedback?(expected_color.to_sym)
end
