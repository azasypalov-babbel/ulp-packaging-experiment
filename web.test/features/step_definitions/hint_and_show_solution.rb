############### STEPS CONCERNING GAP HELP AND SHOW SOLUTION ###############

Then("I ask for a hint") do
  @current_page.request_hint
end

Then("I ask for the solution") do
  @current_page.request_solution
end

Then("I should see the letters of the first solution shuffled") do
  assert @current_page.solution_letters_shuffled?
end

Then("I should see the letters of the first solution in order") do
  assert @current_page.solution_letters_ordered?
end

Then("I should not see a hint or solution button") do
  assert !@current_page.hint_button_shown?
  assert !@current_page.solution_button_shown?
end

Then("I should see the unordered {string} letters in the hint") do |string|
  assert @current_page.solution_letters_shuffled?(string)
end

Then("I should see the ordered {string} letters in the hint") do |string|
  assert @current_page.solution_letters_ordered?(string)
end
