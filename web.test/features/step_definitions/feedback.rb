############### STEPS CONCERNING GAP FEEDBACK ###############

Then("I see that I have solved the gap") do
  assert @current_page.gap_solved?
end

Then(/^I see that I (was|made) a? ?mistaken?$/) do |_|
  assert @current_page.gap_mistaken?
end

Then(/^I( should)? see that I made a typo$/) do |_|
  assert @current_page.gap_typo?
end

Then("I do not see the feedback") do
  assert @current_page.feedback_disappeared?
end

When("I choose to try again") do
  @current_page.click_try_again_button
end

When("I choose to try again using the keyboard") do
  @current_page.hit_return_key_on_try_again_button
end

When("I dismiss the feedback") do
  @current_page.dismiss_feedback
end

When("I dismiss the feedback using the keyboard") do
  @current_page.dismiss_feedback_with_keyboard
end

Then(/^I should see a (positive|negative) feedback message$/) do |type_of_feedback|
  assert @current_page.feedback_message_type == type_of_feedback
end
