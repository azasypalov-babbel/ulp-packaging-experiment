############### STEPS ON THE TRAINER END PAGE ###############

Then("I am on a trainer end page") do
  # rubocop:disable Style/ConditionalAssignment
  if webview?
    @current_page = Pages::TrainerEndIos.new
  elsif unlocked?
    @current_page = Pages::TrainerEndContentUnlocked.new
  else
    @current_page = Pages::TrainerEndContentLocked.new
  end
  assert @current_page.page_detected?
  # rubocop:enable Style/ConditionalAssignment
end

Then("I should see that I correctly answered {int} out of {int} questions in the lesson") do |correct, total|
  assert @current_page.end_score_is(correct, total)
end

When("I check that the Access Content button leads to the prices page") do
  unless  webview?  # there is no access content button in iOS
    assert @current_page.access_content_button_leads_to_prices_page?
  end
end

Then("I should see that the Access Content button has the correct text") do
  unless webview?  # there is no access content button in iOS
    expected_text = "Access all German content"
    actual_text = @current_page.access_content_button.text
    msg = "Expected text: '#{expected_text}', actual text: '#{actual_text}'"
    assert(actual_text == expected_text, msg)
  end
end

Then("I should see a Return Home button") do
  # on iOS, the return home button is called 'Continue', and it is the only
  # button on the lesson end page
  assert !@current_page.return_home_button.nil?
end

Then("I should not see a Return Home button") do
  # on iOS, this button is always there so this step can't be executed
  unless webview?
    assert !@current_page.return_home_button_visible?
  end
end

Then("I should see a Correct Errors button") do
  unless webview?  # there is no correct errors button in iOS
    assert @current_page.correct_errors_button_visible?
  end
end

Then("I should not see a Correct Errors button") do
  unless webview?  # there is no correct errors button in iOS
    assert !@current_page.correct_errors_button_visible?
  end
end

When("I click on the Correct Errors button") do
  # on iOS, we shouldn't run scenarios that click on the button and have the
  # @correct_errors button
  @current_page.correct_errors_button.click
end

Then("I should see that the Correct Errors button has/contains the text {string}") do |expected_text_part|
  unless webview?  # there is no correct errors button in iOS
    actual_text = @current_page.correct_errors_button.text
    msg = "The actual text is: #{actual_text}"
    assert(@current_page.correct_errors_button_contains_text?(expected_text_part), msg)
  end
end

Then("I should see that the motivational message is in {string}") do |expected_language|
  assert @current_page.feedback_message_language == expected_language
end

Then("I should see that the motivational message contains {string}") do |expected_username|
  assert @current_page.feedback_message_contains expected_username
end
