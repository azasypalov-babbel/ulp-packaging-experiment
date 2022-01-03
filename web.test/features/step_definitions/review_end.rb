############### STEPS ON THE REVIEW END PAGE ###############

Then("I am on a review end page") do
  @current_page = Pages::ReviewEnd.new
  assert @current_page.page_detected?
end

Then("I should see that there is/are {int} item(s) in the 'Incorrect' box") do |expected_wrong_answers|
  assert expected_wrong_answers.to_i == @current_page.get_number_of_wrong_answers
end

Then("I should see that there is/are {int} item(s) in the 'Correct' box") do |expected_correct_answers|
  assert expected_correct_answers.to_i == @current_page.get_number_of_correct_answers
end

Then("I should not see an 'Incorrect' box") do
  assert !@current_page.incorrect_box_visible?
end

Then("I should not see a 'Correct' box") do
  assert !@current_page.correct_box_visible?
end

Then("I should see that the feedback message grade is {string}") do |grade|
  assert @current_page.feedback_message_grade == grade
end

Then("I should see a Close button") do
  assert @current_page.close_button_visible?
end

Then("I should not see a Close button") do
  assert !@current_page.close_button_visible?
end

Then("I should see a Review More button") do
  assert @current_page.review_more_button_visible?
end

Then("I should not see a Review More button") do
  assert !@current_page.review_more_button_visible?
end

Then("I should not see a review Correct Errors button") do
  assert !@current_page.correct_errors_button_visible?
end

When("I choose to correct my errors") do
  @current_page.click_correct_errors_button
end

When("I choose to review more items") do
  @current_page.click_review_more_button
end

Then("I should see that I can correct my {int} mistake/mistakes") do |expected_correctable_items|
  unless webview? || expected_correctable_items == @current_page.get_number_of_correctable_items.to_i
    raise "displayed text was #{@current_page.correct_errors_button.text}"
  end
end
