# frozen_string_literal: true

require "active_support"
require "active_support/core_ext/string"
require "appium_lib"
require "selenium-webdriver"

module Pages

  class Base

    include ExtendedWorld

    attr_reader :default_timeout

    def initialize
      @default_timeout = ENV["DEFAULT_TIMEOUT"].nil? ? 10 : ENV["DEFAULT_TIMEOUT"].to_i
      @page_selector_xpath = nil
      @page_locator_id = nil
    end

    def wait_for_any(locator, selectors, timeout = @default_timeout)
      custom_wait(timeout).until do
        selectors.each do |name, selector|
          eles = wait_for_elements(locator, selector, 0.5)
          if eles.length.positive?
            return [eles.first, name]
          end
        end
      end
      [nil, nil]
    end

    def appium_wait_for_element(selector, locator, new_timeout)
      driver.manage.timeouts.implicit_wait = new_timeout
      element = wait_for_element(selector, locator)
      driver.manage.timeouts.implicit_wait = @default_timeout
      element
    end

    def appium_wait_for_elements(selector, locator, new_timeout)
      driver.manage.timeouts.implicit_wait = new_timeout
      elements = wait_for_elements(selector, locator)
      driver.manage.timeouts.implicit_wait = @default_timeout
      elements
    end

    def wait_for_element(selector, locator, timeout = nil)
      if webview? && !timeout.nil?
        return appium_wait_for_element(selector, locator, timeout)
      end

      custom_wait(timeout).until do
        element = driver.find_element(selector, locator)
        return element if element.displayed?
      end
    end

    def wait_for_elements(selector, locator, timeout = nil)
      if webview? && !timeout.nil?
        return appium_wait_for_elements(selector, locator, timeout)
      end

      # This function will not raise stale element exception.
      # It returns and empty list or a list of elements.
      elements = Array.new
      custom_wait(timeout).until do
        elements = driver.find_elements(selector, locator)
        elements.length.positive?
      end
      elements
    rescue Selenium::WebDriver::Error::TimeoutError
      elements
    end

    def wait_for_first_visible_element_of_list(selector, locator, timeout = @default_timeout)
      custom_wait(timeout).until do
        elements = driver.find_elements(selector, locator).select(&:visible?)
        return elements.first unless elements.empty?
      end
      raise "no visible element found with #{selector}: #{locator}"
    end

    def url_contains_arguments?(host_name, *args)
      # First check if the current url contains the host_name
      # that was passed.
      # Then check if the current url contains all args
      return false unless url_contains_host_name?(host_name)

      args.all? { |arg| driver.current_url.include? arg }
    end

    def switch_to_webview
      custom_wait(120).until do
        driver.available_contexts.any? do |context|
          context.match(/WEBVIEW/)
        end
      end
      driver.set_context(driver.available_contexts[-1])
      assert driver.current_context.downcase.include? 'webview'
    end

    def url_contains_host_name?(host_name)
      driver.current_url.include?(host_name)
    end

    def change_url_to_staging
      url = driver.current_url
      url.gsub! 'com', 'cn'
      driver.navigate.to(url)
    end

    def set_url_param(key, value)
      url = driver.current_url
      current_params = url.split('?').last.split('&')
                          .map { |x| { key: x.split('=').first, value: x.split('=').last } }

      unless current_params.any? { |x| x[:key] == key }
        driver.navigate.to("#{url}&#{key}=#{value}")
        return
      end

      current_params.delete_at(current_params.index { |x| x[:key] == key })
      new_params = current_params.map { |x| "#{x[:key]}=#{x[:value]}" }.join('&')
      driver.navigate.to("#{url.split('?').first}?#{new_params}")
    end

    def headless?
      driver.options[:desired_capabilities]["chromeOptions"]["args"].include? "--headless"
    rescue
      false
    end

    def fill_in_field(field, text)
      field.click
      field.clear
      field.send_keys(text)
    end

    def wait_until_page_is_loaded
      custom_wait(@default_timeout).until do
        driver.execute_script("return document.readyState;") == "complete"
      end
    end

    def page_detected?
      wait_until_page_is_loaded
      if !@page_selector_css.nil?
        wait_for_element(:css, @page_selector_css)
      elsif !@page_selector_xpath.nil?
        wait_for_element(:xpath, @page_selector_xpath)
      elsif !@page_selector_id.nil?
        wait_for_element(:id, @page_selector_id)
      elsif !@page_selector_name.nil?
        wait_for_element(:name, @page_selector_css)
      else
        raise "you must provide either @page_selector_name|css|id|xpath"
      end
      true
    end

    # to make it easier for those python developers out there
    def print(some_string)
      require 'awesome_print'
      ap some_string
    end

    def wait_and_do_nothing(seconds)
      sleep seconds
    end

    def scroll_to_element(element)
      x = element.location_once_scrolled_into_view.x
      y = element.location_once_scrolled_into_view.y
      driver.execute_script("window.scrollTo(#{x},#{y});")
    end

    def hit_letter_key(letter)
      driver.action.send_keys(letter).perform
    end

    def hit_return_key
      driver.action.send_keys(:return).perform
    end

    def hit_backspace_key
      driver.action.send_keys(:backspace).perform
    end

    def hit_escape_key
      driver.action.send_keys(:escape).perform
    end

    def hit_key_with_text(text)
      assert text.length == 1
      driver.action.send_keys(text).perform
    end

    def mouse_over_element(element)
      driver.action.move_to(element).perform
    end

    def click_on_title
      wait_for_element(:css, "[data-selector='title']").click
    end

    def set_cookie(cookie_name, cookie_value)
      if driver.manage.all_cookies.each.map { |x| x[:name] }.include? cookie_name
        driver.manage.delete_cookie cookie_name
      end
      driver.manage.add_cookie name: cookie_name, value: cookie_value
      driver.navigate.refresh
      sleep SLEEP_SHORT
      assert driver.manage.all_cookies.each.map { |x| x[:name] }.include? cookie_name
    end

    def custom_wait(timeout)
      timeout ||= @default_timeout
      Selenium::WebDriver::Wait.new(
        timeout: timeout,
        ignore: [
          Selenium::WebDriver::Error::StaleElementReferenceError,
          Selenium::WebDriver::Error::NoSuchElementError
        ]
      )
    end

  end

end

module Selenium

  module WebDriver

    class Element

      def disabled?
        !enabled?
      end

      def visible
        displayed?
      end

      def visible?
        displayed?
      end

      def html
        attribute('outerHTML')
      end

    end

  end

end

class String

  def numeric?
    !Float(self).nil?
  rescue
    false
  end

end
