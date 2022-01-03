############### COMMON STEPS NOT ASSOCIATED WITH ANY PAGE ###############
############### THEY ARE ALSO HELPFUL WHEN DEBUGGING      ###############

Then("I launch the debugger") do
  binding.pry  # rubocop:disable Lint/Debugger
end

When("I hit the return key") do
  @current_page.hit_return_key
end

When("I hit the {string} key") do |letter|
  @current_page.hit_letter_key(letter)
end

When("I set the URL param {string} to {string}") do |key, value|
  @current_page.set_url_param(key, value)
end

When("I hit the backspace key") do
  @current_page.hit_backspace_key
end

When("I resize the window to {int} x {int}") do |width, height|
  driver.manage.window.resize_to width, height
end

Then("I wait for the animations to stop") do
  sleep 2
end

Given('I set the cookie {string} with the value {string}') do |cookie_name, cookie_value|
  @current_page.set_cookie(cookie_name, cookie_value)
end

### formatting ###
Then("I should see {string} on the choicebutton with the number {int} in bold") do |word, button_number|
  assert @current_page.bold_word_visible_on_choicebutton?(word, button_number)
end

Then("I should see {string} on the choicebutton with the number {int} in italic") do |word, button_number|
  assert @current_page.italic_word_visible_on_choicebutton?(word, button_number)
end

Then("I should see {string} within {string} in bold") do |word, item_type|
  assert @current_page.bold_word_visible_in_text?(word, item_type)
end

Then("I should see {string} within {string} in italic") do |word, item_type|
  assert @current_page.italic_word_visible_in_text?(word, item_type)
end

# on some pages (for example, review end), words are shown, but in this case,
# they are not supposed to be formatted, although in the original json file, they
# might be written as **bold** or "italic"
Then("I should not see {string} within {string} in either bold or italic") do |word, item_type|
  assert !@current_page.bold_word_visible_in_text?(word, item_type)
  assert !@current_page.italic_word_visible_in_text?(word, item_type)
end

Then("I should not see any babbel markup characters anywhere on the page") do
  assert !@current_page.formatting_characters_visible_on_page?
end
