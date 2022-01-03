############### STEPS ON THE REVIEW PAGES ###############

Given(/^I visit the demo review page( as a customer)?$/) do |paying_user|
  if webview?
    review_on_ipad(paying_user)
  else
    review_on_web(paying_user)
  end
end

Given("I visit the demo review page with {string}") do |review_items|
  if webview?
    review_on_ipad(false)
  else
    review_on_web(false)
  end

  @current_page.set_url_param("mock_review_items", review_items)
end

def review_on_ipad(paying_user)
  @current_page = Pages::Demo.new
  @current_page.switch_to_webview
  if paying_user
    @current_page.click_on_start_review_as('customer')
  else
    @current_page.click_on_start_review_as('lead')
  end
  sleep SLEEP_SHORT
  @current_page = Pages::Review.new
end

def review_on_web(paying_user)
  test_env = ENV["TEST_ENV"]
  @current_page = Pages::Review.new
  return_url = "example.com"
  url = "#{test_env}/en/lesson-player/DEU/review?"\
        "is_demo=on"\
        "&is_unlocked=#{paying_user ? 'on' : 'off'}"\
        "&return_url=#{return_url}"
  driver.navigate.to url
end

### choose review type screen ###
Then("I am on the demo review page") do
  @current_page = Pages::Review.new
  assert @current_page.page_detected?
end

When("I choose the {string} review") do |review_type|
  @current_page.click_review_start_button(review_type)
end

When("I choose to continue without microphone") do
  @current_page.click_review_start_without_mic_button
end

Then("I see different review choices") do
  assert @current_page.review_choices_visible?
rescue
  log driver.find_element(:css, "body").text
  log driver.find_element(:css, "body").html
end

### review page keyboard shortcuts ###
When("I want to use the keyboard shortcuts") do
  @current_page.set_use_keyboard_shortcuts
end

### speaking review ###
Then("I click on the speaking continue button") do
  @current_page.click_speaking_continue_button
end

### listening review ###
Then("I see on the sound button that the sound is not playing") do
  assert !@current_page.sound_icon_is_playing?
end

Then("I wait for the choice list items to appear") do
  @current_page.wait_for_choice_list_items
end

When("I click on the Got It button") do
  @current_page.got_it_button.click
end
