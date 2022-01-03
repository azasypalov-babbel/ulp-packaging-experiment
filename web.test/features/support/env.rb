require "appium_lib"
require "faker"
require "pry"
require "yaml"
require "dotenv"

require_relative "extended_world"
require_relative "cucumber_testcase"

Dotenv.load

load_paths = ['../../web']
load_paths.each do |path|
  # rubocop:disable Lint/NonDeterministicRequireOrder
  Dir["#{File.dirname(__FILE__)}/#{path}/**/*.rb"].each { |f| require f }
  # rubocop:enable Lint/NonDeterministicRequireOrder
end

driver_config = YAML.safe_load(ERB.new(File.read("#{File.dirname(__FILE__)}/../../config/config.yml")).result)

driver_label = ENV['DRIVER']
unless driver_label
  raise "Driver not set. Please start the test with 'DRIVER=<your driver> bundle exec ...' "\
        "Your driver can be any driver name specified in config/config.yml under drivers"
end

World(ExtendedWorld)

SLEEP_VERYSHORT = 0.3
SLEEP_SHORT = 1
SLEEP_MEDIUM = 1.5
SLEEP_LONG = 2
SLEEP_EVENLONGER = 3
UNREACHABLE_NUMBER_OF_QUESTIONS = 100

def assert(condition, message = "")
  unless condition
    raise message
  end
end

# scenario hook - should run before each scenario is run
Before do
  config = driver_config["drivers"][driver_label].symbolize_keys!
  create_driver(config)
  # appium ignores our custom Selenium::WebDriver::Waits
  if driver_config[:type] == :appium
    driver.manage.timeouts.implicit_wait = driver_config["command_timeout"]
  end
end

def take_screenshot(filename = nil)
  timestamp = get_string_timestamp
  if filename.nil?
    filename = "#{timestamp}.png"
  else
    filename += "_#{timestamp}.png"
  end
  img = driver.screenshot_as(:png)
  File.open("screenshots/#{filename}", 'wb') { |fh| fh.write img }
rescue
  puts "couldn't take a screenshot due to #{$!}!"
end

def class_from_string(str)
  str.split('::').inject(Object) do |mod, class_name|
    mod.const_get(class_name)
  end
end

def get_string_timestamp
  Time.zone = "Europe/Berlin"
  # rubocop:disable Style/RedundantArgument
  Time.zone.now.to_s.split(" ")[0, 2].join("_")
  # rubocop:enable Style/RedundantArgument
end

def unlocked?
  driver.current_url.include? "is_unlocked=on"
end

def webview?
  driver.to_s.include? 'Appium'
end

# after each testcase, in case of failure take a screenshot
After do |testcase|
  if testcase.failed?
    timestamp = get_string_timestamp
    filename = "failure-#{testcase.name.gsub(/[()# '",.]/, '')}-#{timestamp}.png"
    take_screenshot(filename)
  end
  destroy_driver
end

at_exit do
  # shut down firefox running with geckodriver
  # as driver looses the connection to browser before killing the proccess
  result = `ps aux | grep -E 'firefox.+?marionette'`
  pid = result.split[1]
  `kill #{pid} > /dev/null 2>&1`
end

AfterStep do
  if ENV['TAKE_SCREENSHOTS']
    take_screenshot
  end
end
