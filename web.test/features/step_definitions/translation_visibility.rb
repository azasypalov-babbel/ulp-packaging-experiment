############### STEPS CONCERNING TRANSLATION VISIBILITY ###############

Then("I toggle the translation") do
  @current_page.translation_toggle.click
end

Then("I click on the translation toggle button") do
  @current_page.translation_toggle.click
end

Then("I should see a translation string") do
  assert @current_page.translation_string_visible?
end

Then("I should see a translation toggle symbol") do
  assert @current_page.translation_toggle_visible?
end

Then("I should not see a translation string") do
  assert !@current_page.translation_string_visible?
end

Then("I should not see a translation toggle symbol") do
  assert !@current_page.translation_toggle_visible?
end
