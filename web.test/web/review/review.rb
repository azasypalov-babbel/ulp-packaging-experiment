require_relative "../web_base"
require_relative "../shared_modules"

module Pages

  class Review < WebBase

    include ProgressBar

    REVIEW_INDICATOR_CSS = "[data-selector='review-menu-screen']".freeze
    REVIEW_LESSON_START_BUTTON_CSS = "[data-selector='review-menu-screen-%<review_type>s-button']".freeze
    MIC_PERMISSION_CONTINUE_CSS = "[data-selector='continue-button']".freeze
    CONTINUE_CSS = "div.button-container button".freeze
    REVIEW_CHOICES_CSS = "[data-selector='review-menu-screen']".freeze

    def initialize
      super()
      @page_selector_css = REVIEW_INDICATOR_CSS
      @use_keyboard = false
    end

    def click_review_start_button(review_type)
      review_types_conversion = {
        Flashcards: "flashcard",
        Writing: "write",
        Speaking: "speak",
        Listening: "listen"
      }
      css = format(
        REVIEW_LESSON_START_BUTTON_CSS,
        review_type: review_types_conversion[review_type.to_sym]
      )
      wait_for_element(:css, css).click
    end

    def click_review_start_without_mic_button
      sleep SLEEP_SHORT
      element = wait_for_element(:css, CONTINUE_CSS)
      sleep SLEEP_VERYSHORT
      element.click
    end

    def review_choices_visible?
      wait_for_elements(:css, REVIEW_CHOICES_CSS).length.positive?
    end

    def click_speaking_continue_button
      sleep SLEEP_SHORT
      wait_for_element(:css, MIC_PERMISSION_CONTINUE_CSS).click
    end

  end

end
