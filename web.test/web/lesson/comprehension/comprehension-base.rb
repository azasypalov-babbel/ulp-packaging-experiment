require_relative "../trainer"

module Pages

  class ComprehensionBase < TrainerBase

    COMPREHENSIONBASE_INDICATOR_CSS = "[data-trainer-type='comprehension'][data-trainer-interaction='choose']".freeze
    COMPREHENSION_DESCRIPTION_CSS = "[data-item-type='description'] "\
                                    "[data-text-type='contextual-info'][data-selector='non-interactive']".freeze
    COMPREHENSION_QUESTIONSHEETEXPANDED_CSS = "[data-selector='question-sheet-expanded']".freeze
    COMPREHENSION_ARROWUP_CSS = "[data-selector='arrow-up']".freeze
    COMPREHENSION_ARROWDOWN_CSS = "[data-selector='arrow-down']".freeze

    COMPREHENSION_QUESTIONCOUNT_CSS = "[data-question-count]".freeze
    COMPREHENSION_QUESTION_CSS = "[data-selector='question']".freeze
    COMPREHENSION_CORRECT_ANSWER_CSS = "[data-correct='true']".freeze
    COMPREHENSION_WRONG_ANSWER_CSS = "[data-correct='false']".freeze
    COMPREHENSION_BUTTONBYTEXT_CSS = "[data-choice='%<sentence>s']".freeze
    COMPREHENSION_TITLE_CSS = "[data-selector='title']".freeze
    COMPREHENSION_ITEMTEXT_CSS = "[data-selector='item-text']".freeze

    def initialize
      super
      assert driver.find_element(css: COMPREHENSIONBASE_INDICATOR_CSS)
    end

    def fill_in_correct_answer
      wait_for_elements(:css, COMPREHENSION_CORRECT_ANSWER_CSS).sample.click
    end

    def fill_in_wrong_answer
      wait_for_elements(:css, COMPREHENSION_WRONG_ANSWER_CSS).sample.click
    end

    def show_slide_container
      element = wait_for_element(:css, COMPREHENSION_ARROWUP_CSS)
      element.click
      wait_for_element(:css, COMPREHENSION_QUESTIONSHEETEXPANDED_CSS)
    end

    def hide_slide_container
      element = wait_for_element(:css, COMPREHENSION_ARROWDOWN_CSS)
      element.click
      wait_for_element(:css, COMPREHENSION_QUESTIONSHEETDOWN)
    end

    # only the UP button can be active (= highlighted)
    def arrow_button_active?
      selector = "#{COMPREHENSION_ARROWUP_CSS}[data-button-active='true']"
      wait_for_elements(:css, selector).length.positive?
    end

    def click_comprehension_button_with_text(text)
      wait_for_element(:css, Kernel.format(COMPREHENSION_BUTTONBYTEXT_CSS, sentence: text)).click
    end

    def title
      !wait_for_element(:css, COMPREHENSION_TITLE_CSS, 2).text.empty?
    end

    def description
      !wait_for_element(:css, COMPREHENSION_DESCRIPTION_CSS, 2).text.empty?
    end

    def currently_on_question?(current, total)
      matches = wait_for_element(:css, COMPREHENSION_QUESTIONCOUNT_CSS).text.match(%r{\s(\d)/(\d)})
      actual_current = matches[1].to_i
      actual_total = matches[2].to_i
      current == actual_current && total == actual_total
    end

    def question
      !wait_for_element(:css, COMPREHENSION_QUESTION_CSS).text.empty?
    end

    def correct_answer_count
      wait_for_elements(:css, COMPREHENSION_CORRECT_ANSWER_CSS).length
    end

    def count_item_texts
      wait_for_elements(:css, COMPREHENSION_ITEMTEXT_CSS).select(&:visible).length
    end

    def up_arrow_visible?(timeout = nil)
      timeout ||= @default_timeout
      wait_for_element(:css, COMPREHENSION_ARROWUP_CSS, timeout).visible?
    rescue
      false
    end

    def down_arrow_visible?(timeout = nil)
      timeout ||= @default_timeout
      wait_for_element(:css, COMPREHENSION_ARROWDOWN_CSS, timeout).visible?
    rescue
      false
    end

    def question_sheet_expanded?(timeout = nil)
      timeout ||= @default_timeout
      wait_for_elements(:css, COMPREHENSION_QUESTIONSHEETEXPANDED_CSS, timeout).length.positive?
    end

    def arrow_button_visible?(direction, color, timeout = nil)
      timeout ||= @default_timeout
      active = (color == "orange" && direction == "up") || (direction == "down")
      constname = "COMPREHENSION_ARROW#{direction.upcase}_CSS"
      selector = "#{Pages::ComprehensionAudioTrainer.const_get(constname)}[data-button-active='#{active}']"
      wait_for_elements(:css, selector, timeout).length.positive?
    end

  end

end
