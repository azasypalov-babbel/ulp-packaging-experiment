require_relative "../../web_base"
require_relative "../../shared_modules"

module Pages

  class TrainerEndIos < WebBase

    include ProgressBar

    TRAINEREND_IOS_IDENTIFYER_CSS = "div.loy-lesson-end-screen".freeze
    TRAINEREND_IOS_SCORE_CSS = "h2.loy-lesson-end-screen-feedback-answers-counter__counter span".freeze
    TRAINEREND_IOS_RETURNHOME_CSS = "*[data-selector='return-home-button']".freeze
    SHORT_TIMEOUT = 2
    TRAINEREND_IOS_FEEDBACK_MESSAGE_CSS = ".loy-lesson-end-screen-feedback-message__text".freeze
    TRAINEREND_IOS_FEEDBACK_MESSAGE_HASH = {
      "Das war super" => "German",
      "Fantastique" => "French",
      "Great Job" => "English"
    }.freeze

    def initialize
      super()
      @page_selector_css = TRAINEREND_IOS_IDENTIFYER_CSS
      check_page_looks_correct
    end

    def return_home_button
      # on iOS, there is only one button, the Continue button
      # the Continue button uses the data-selector return-home
      wait_for_element(:css, TRAINEREND_IOS_RETURNHOME_CSS)
    end

    def lesson_endpage?
      true
    end

    def return_home_button_visible?
      wait_for_element(:css, TRAINEREND_IOS_RETURNHOME_CSS, SHORT_TIMEOUT).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def number_of_visible_buttons
      # on iOS, this is always 1
      driver.find_elements(css: "button").select(&:visible?).length
    end

    def feedback_message_language
      motivational_text = feedback_message_text.split(',').first
      TRAINEREND_IOS_FEEDBACK_MESSAGE_HASH[motivational_text]
    rescue KeyError
      ""
    end

    def feedback_message_contains(expected_text)
      feedback_message_text.include? expected_text
    end

    def feedback_message_grade
      feedback_h1 = driver.find_element(css: TRAINEREND_IOS_FEEDBACK_MESSAGE_CSS)
      feedback_h1.attribute('data-feedback-grade')
    end

    def parse_score
      element = wait.until { driver.find_element(:css, "[data-lesson-score]") }
      text = element.attribute('data-lesson-score')

      pattern = /(\d+)[^\d]+(\d+)/
      matches = text.match pattern
      [matches[1].to_i, matches[2].to_i]
    end

    def end_score_is(correct, total)
      wait_for_element(:css, "[data-lesson-score='#{correct}/#{total}']")
      true
    rescue
      false
    end

    private

    def feedback_message_text
      driver.find_element(css: TRAINEREND_IOS_FEEDBACK_MESSAGE_CSS).text
    end

    def check_page_looks_correct
      assert(progress_bar_at_percent?(100))
      assert return_home_button_visible?
      assert number_of_visible_buttons == 1
      assert return_home_button.text == 'Continue learning'
    end

  end

end
