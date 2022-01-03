############### STEPS ON THE LEARNING TIP PAGE ###############

Then("I am on the Learning Tip Page") do
  @current_page = Pages::LearningTip.new
  assert @current_page.page_detected?
end

Then("I can see an icon, a title, a tip, and a button") do
  assert @current_page.all_required_elements_are_visible?
end
