############### STEPS ON THE LESSON-PLAYER DEMO PAGE ###############

Given(/^I visit the demo index page( as a customer)?$/) do |paying_user|
  if webview?
    @current_page = Pages::Demo.new
    @current_page.switch_to_webview
  else
    visit_demo_page("DEU", paying_user)
    sleep SLEEP_SHORT
  end
end

Given(/^I visit the "([^"]+)" demo lesson (as a customer)?$/) do |lesson_name, paying_user|
  visit_lesson_directly(lesson_name, paying_user)
end

def visit_lesson_directly(lesson_name, paying_user)
  test_env = ENV["TEST_ENV"]
  @current_page = Pages::Demo.new
  params = "is_demo=on&learningActivityId=mocked-uncompleted-lesson-id&is_refer_a_friend=off"
  url = "#{test_env}/en/lesson-player/FRA/#{lesson_name}?#{params}&is_unlocked=#{paying_user ? 'on' : 'off'}"
  driver.navigate.to url
end

pattern = /^I visit the "([^"]+)" demo index page( as a customer)?( with flags "(.*)")?$/
Given(pattern) do |learn_lang_alpha3, paying_user, flags|
  visit_demo_page(learn_lang_alpha3, paying_user, flags)
end

def visit_demo_page(learn_lang_alpha3, paying_user, flags = "")
  test_env = ENV["TEST_ENV"]
  @current_page = Pages::Demo.new
  url = "#{test_env}/en/lesson-player/#{learn_lang_alpha3}/demo?is_unlocked=#{paying_user ? 'on' : 'off'}&#{flags}"
  driver.navigate.to url
end

When("I click on the {string} button") do |lesson_name|
  @current_page.click_lesson_start_button(lesson_name)
end

When("I choose to continue without speech recognition") do
  @current_page.continue_without_speech_recognition
end

When("I choose to continue with speech recognition") do
  @current_page.continue_with_speech_recognition
end
