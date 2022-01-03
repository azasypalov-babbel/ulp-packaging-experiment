############### STEPS CONCERNING THE PROGRESS BAR ###############

Then(%r(^I should see "(\d+)/(\d+)" in the progress bar$)) do |current_trainer_index, number_of_trainers_total|
  expected_current_trainer_index = current_trainer_index.to_i
  expected_number_of_trainers_total = number_of_trainers_total.to_i
  actual_numbers = @current_page.get_progress_numbers
  assert expected_current_trainer_index == actual_numbers[:current_index]
  assert expected_number_of_trainers_total == actual_numbers[:trainers_total]
end

Then("I want to see that the number in the progress bar increases after every item") do
  @current_page.set_check_progress_bar_number_increses
end

When("I complete the trainer with {int} mistakes and "\
     "check that the progress bar end score is {string}") do |number_of_mistakes, string|
  end_score_left = string.split("/").first.to_i
  end_score_right = string.split("/").last.to_i
  @current_page.finish_trainer_and_check_end_score(number_of_mistakes, end_score_left, end_score_right)
end
