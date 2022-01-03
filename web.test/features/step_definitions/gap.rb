############### STEPS CONCERNING THE GAPS ###############

And("the words are") do |table|
  words = @current_page.get_sorted_words
  sorted_solutions = table.raw.map { |row| row[0] }.sort
  assert words == sorted_solutions
end

And("there are {int} gaps") do |count|
  assert @current_page.count_gaps == count
end

And("(I see )the gaps( are)") do |table|
  assert @current_page.get_all_visible_solutions == table.raw.map { |row| row[0] }
rescue
  log "expecting the words #{table.raw.map { |row| row[0] }}, but got #{@current_page.get_all_visible_solutions}"
  raise
end

# active gap / inactive gap
And("there is only one active gap") do
  assert @current_page.count_active_gaps == 1
end

Then(/^the (\d+)(?:st|nd|rd|th) gap is(?: still)? active$/) do |number|
  assert @current_page.gap_at_index_active?(number)
end

Then(/^the (\d+)(?:st|nd|rd|th) gap is not active$/) do |number|
  assert !@current_page.gap_at_index_active?(number, 2)
end

Then("the {string} gap is( still) active") do |solution|
  assert @current_page.gap_with_solution_active?(solution)
end

Then("the {string} gap is not active") do |solution|
  assert !@current_page.gap_with_solution_active?(solution, 2)
end

Then("I should not see an active gap") do
  assert @current_page.no_active_gap_visible?
end

# actions on gap
When("I press return on the gap") do
  @current_page.hit_key_on_gap("return")
end

When("I press backspace on the gap") do
  @current_page.hit_key_on_gap(:backspace)
end

When("I clear the gap") do
  @current_page.clear_gap
end

When("I cheat") do
  @current_page.cheat_one
end

When("I cheat all gaps up to the next continue button") do
  @current_page.skip_gaps(cheat: true, auto_continue: false)
end

When("I cheat all( remaining) gaps") do
  @current_page.skip_gaps(cheat: true)
end

When("I cheat to the {string} gap") do |target_gap_solution|
  @current_page.skip_gaps(cheat: true, until_solution: target_gap_solution)
end

When("I arrive at the next gap") do
  @curent_page.wait_for_next_gap
end

When("I arrive at the next gap dismissing any info text") do
  @curent_page.wait_for_next_gap(auto_dismiss_info_texts: true)
end

When("I solve all( remaining) gaps dismissing any info text") do
  @current_page.skip_gaps
end

# submit hint / how to submit your answer
Then("I wait for something to happen") do
  sleep 5
end

When("I should see a submit hint") do
  assert @current_page.submit_hint_visible?
end

When("I should not see a submit hint") do
  assert !@current_page.submit_hint_visible?(1)
end

When("I focus on something else") do
  @current_page.focus_on_body
end

When("I wait until I see the next question and answer(s)") do
  # wait for animations to stop
  sleep SLEEP_MEDIUM
  assert @current_page.active_gap_exists?
end

# This following two step work and make sense only for trainers that
# 1. have all items on one page like card or dialog, and
# 2. have the attributes [data-item-type="for-example-phrase"] and [data-selector="for-example-interactive"]
# In trainers like vocabulary where only 1 item per page is visible, it's always going to be the
# first item that is interactive. A mistaken item won't be shown back to the user in purge at all
Then(/^I should see that the (\d+)(?:st|nd|rd|th) item is noninteractive$/) do |gap_index|
  assert !@current_page.item_at_index_interactive?(gap_index - 1)
end

Then(/^I should see that the (\d+)(?:st|nd|rd|th) item is(?: still)? interactive$/) do |gap_index|
  assert @current_page.item_at_index_interactive?(gap_index - 1)
end
