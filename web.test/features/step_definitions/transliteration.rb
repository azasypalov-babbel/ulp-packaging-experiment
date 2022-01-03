############### STEPS CONVERNING TRANSLITERATION ###############

Then("I should see transliteration instructions {string}") do |expected|
  instructions = @current_page.get_instruction_text
  assert instructions.include? expected
end

Then("I click on the transliteration toggle button") do
  @current_page.transliteration_toggle.click
end
