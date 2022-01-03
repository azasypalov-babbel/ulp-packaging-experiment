require_relative "../../web_base"
require_relative "../../shared_modules"

module Pages

  class TrainerEndContentUnlocked < WebBase

    include ProgressBar

    TRAINEREND_SB_IDENTIFYER_CSS = "[data-selector='lesson-end-screen-container']".freeze
    TRAINEREND_SB_SCORE_CSS = "h2.loy-lesson-end-screen-feedback-answers-counter__counter span".freeze
    TRAINEREND_SB_RETURNHOME_CSS = "*[data-selector='return-home-button']".freeze
    TRAINEREND_SB_CORRECTERRORS_CSS = "*[data-selector='correct-errors-button']".freeze
    SHORT_TIMEOUT = 2
    TRAINEREND_SB_FEEDBACK_MESSAGE_CSS = ".loy-lesson-end-screen-feedback-message__text".freeze
    TRAINEREND_SB_FEEDBACK_MESSAGE_HASH = {
      "Das war super" => "German",
      "Fantastique" => "French",
      "Great Job" => "English"
    }.freeze

    def initialize
      super()
      @page_selector_css = TRAINEREND_SB_IDENTIFYER_CSS
      assert(progress_bar_at_percent?(100))
      assert !formatting_characters_visible_on_page?(TRAINEREND_SB_IDENTIFYER_CSS)
    end

    def return_home_button
      wait_for_element(:css, TRAINEREND_SB_RETURNHOME_CSS)
    end

    def lesson_endpage?
      true
    end

    def return_home_button_visible?
      wait_for_element(:css, TRAINEREND_SB_RETURNHOME_CSS, SHORT_TIMEOUT).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def correct_errors_button
      wait_for_element(:css, TRAINEREND_SB_CORRECTERRORS_CSS)
    end

    def correct_errors_button_visible?
      wait_for_element(:css, TRAINEREND_SB_CORRECTERRORS_CSS, SHORT_TIMEOUT).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def correct_errors_button_contains_text?(expected_text_part)
      assert correct_errors_button_visible?
      assert correct_errors_button.text.include? expected_text_part
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      puts "actual displayed text: #{correct_errors_button.text}"
      false
    end

    def number_of_visible_buttons
      wait_for_elements(:css, "#{TRAINEREND_SB_IDENTIFYER_CSS} button").select(&:visible?).length
    end

    def feedback_message_language
      motivational_text = feedback_message_text.split(',').first
      TRAINEREND_SB_FEEDBACK_MESSAGE_HASH[motivational_text]
    rescue KeyError
      ""
    end

    def feedback_message_contains(expected_text)
      feedback_message_text.include? expected_text
    end

    def feedback_message_grade
      feedback_h1 = wait_for_element(:css, TRAINEREND_SB_FEEDBACK_MESSAGE_CSS)
      feedback_h1.attribute('data-feedback-grade')
    end

    def end_score_is(correct, total)
      wait_for_element(:css, "[data-lesson-score='#{correct}/#{total}']")
      true
    rescue
      false
    end

    private

    def feedback_message_text
      wait_for_element(:css, TRAINEREND_SB_FEEDBACK_MESSAGE_CSS).text
    end

  end

end
