### matching trainer
Then("I {should_or_not} see that the item {string} has a translation toggle symbol") do |should, text|
  assert @current_page.item_has_translation_toggle?(text, !should.value)
end

Then("I should not see any translation toggle symbol") do
  assert @current_page.count_visible_translation_toggles.zero?
end

Then("I should not see any tooltip") do
  assert @current_page.count_visible_tooltips.zero?
end

When(/I mouse over the (\d\w\w) translation toggle symbol/) do |index|
  @current_page.mouse_over_translation_toggle_at(index.to_i)
end

Then("I should see a tooltip with the text {string}") do |text|
  assert @current_page.tooltip.text == text
rescue
  raise "Wrong tooltip visible: '#{@current_page.tooltip.text}'. Expected was: '#{text}'."
end

When('I click on the button with correct text but non-matching item ID') do
  @current_page.click_alternative_choicebutton
end
