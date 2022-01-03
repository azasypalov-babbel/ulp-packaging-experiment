require "singleton"
require 'appium_lib'
require 'pry'

module ExtendedWorld

  class SingleDriver

    include Singleton

    attr_accessor :driver, :type

    def self.create(options)
      if options[:type] == :appium
        @type = :appium
        appium_lib = {}
        appium_lib[:wait] = 30
        @driver = Appium::Driver.new({ caps: options[:desired_capabilities], appium_lib: appium_lib }, true)
        @driver.start_driver
        instance.driver = @driver
        return
      end

      options[:capabilities].symbolize_keys!
      desired_browser = options[:capabilities][:browser_name]
      capabilities = create_options(options, desired_browser)

      instance.driver = if options[:type] == "selenium-remote"
                          Selenium::WebDriver.for(
                            # if remote url is nil, selenium server will assume localhost
                            :remote, url: options[:url], capabilities: capabilities
                          )
                        else
                          Selenium::WebDriver.for(
                            desired_browser.to_sym, capabilities: capabilities
                          )
                        end
    end

    def self.create_options(options, desired_browser)
      options_classname = "Selenium::WebDriver::#{desired_browser.capitalize}::Options"
      Object.const_get(options_classname).new(args: options[:args], **options[:capabilities])
    end

    def self.quit
      if @type == :appium
        @driver.remove_app(@driver.caps[:bundleId])
        @driver.driver_quit
      else
        instance.driver.quit
      end
    rescue
      puts "Couldn't gracefully quit driver #{driver}"
    end

  end

  def destroy_driver
    SingleDriver.quit
  end

  def create_driver(*args)
    SingleDriver.create(*args)
  end

  def driver
    SingleDriver.instance.driver
  end

end
