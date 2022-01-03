require_relative "web_base"

module Pages

  class Demo < WebBase

    DEMOPAGE_SPEECHOFFBTN_CSS = ".disable-speak".freeze
    DEMOPAGE_SPEECHONBTN_CSS = ".enable-speak".freeze
    DEMOPAGE_SELECTOR_CSS = "div[data-selector='demo-index-page-title']".freeze
    GENERAL_CONTINUE_BUTTON_SELECTOR = "[data-selector='continue-button']".freeze
    START_REVIEW_TEMPLATE = "[data-selector='review-as-%<review_type>s']".freeze
    CTA_BUTTON_CSS = "[data-selector='cta-button']".freeze

    def initialize
      super()
      @page_selector_css = DEMOPAGE_SELECTOR_CSS
    end

    def cta_button
      wait_for_element(:css, CTA_BUTTON_CSS)
    end

    def click_lesson_start_button(lesson_name)
      data_attr = lesson_name.downcase.gsub(/\s+/, '-')
      selector = "a[data-selector=\"#{data_attr}\"]".freeze
      wait_for_element(:css, selector).click
    end

    def continue_without_speech_recognition
      wait_for_element(:css, DEMOPAGE_SPEECHOFFBTN_CSS).click
      wait_for_element(:css, GENERAL_CONTINUE_BUTTON_SELECTOR).click
    end

    def continue_with_speech_recognition
      wait_for_element(:css, DEMOPAGE_SPEECHONBTN_CSS).click
      wait_for_element(:css, GENERAL_CONTINUE_BUTTON_SELECTOR).click
    end

    def click_on_start_review_as(review_type)
      assert %w(lead customer).include?(review_type)
      selector = Kernel.format(START_REVIEW_TEMPLATE, review_type: review_type)
      wait_for_element(:css, selector).click
    end

  end  # end class start

end  # end module
