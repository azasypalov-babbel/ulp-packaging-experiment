############### STEPS CONVERNING INFO TEXTS ###############

# VIEW ALL TIPS (N) BUTTON
Then(/^I should see View All Tips\((\d+)\)$/) do |expected_count|
  actual_count = @current_page.count_info_texts
  assert actual_count == expected_count
end

Then("I should not see the View All Tips button") do
  assert !@current_page.view_all_button_visible?(0)
end

Then(/^I wait until I see View All Tips\((\d+)\)$/) do |expected_count|
  assert @current_page.expected_count_visible?(expected_count)
end

When("I click on View All Tips") do
  @current_page.view_all_button.click
end

# CLOSE BUTTON
Then("I should see a Close Tips button") do
  assert @current_page.close_info_texts_button.visible?
end

# BLUE SIDE BOX
Then("I should see a side box with {int} tips") do |expected_count|
  html = @current_page.sidebox.html
  actual_count = html.match(/data-length="(\d)"/)[1].to_i
  assert actual_count == expected_count
end

Then("the side box is not shown") do
  assert !@current_page.sidebox_visible?(2)
end

Then("the side box is shown") do
  assert @current_page.sidebox_visible?
end

# CLOSE SIDE BOX 'X' BUTTON
Then("I should see an X to close the side box") do
  assert @current_page.x_close_button.visible?
end

When("I click on the X to close the side box") do
  sleep SLEEP_MEDIUM
  @current_page.x_close_button.click
rescue Selenium::WebDriver::Error::ElementClickInterceptedError
  log "the element was not clickable at this point, says chromedriver"
end

Then("the info text is shown") do
  assert @current_page.top_info_text_shown?
end

Then("the info text is not shown") do
  assert @current_page.top_info_text_disappeared?
end

When("I dismiss the/any info text") do
  sleep SLEEP_SHORT
  @current_page.close_info_texts_button.click
end

When("I dismiss the info text using the escape key") do
  @current_page.hit_escape_key
end

Then('the info text contains the text {string}') do |expected_info_text|
  assert @current_page.top_info_text_text.include? expected_info_text
end
