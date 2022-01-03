require_relative "gap"

module Pages

  module Wordorder

    include Gap

    WORDORDER_INDICATOR_CSS = "[data-trainer-interaction='wordorder'][data-trainer-puzzlehelper='false']".freeze
    WORDORDER_SHOWSOLUTION_BUTTON_CSS = "[data-button-type='show-solution']".freeze
    DATACHOICE_BUTTON_TEMPLATE = "[data-choice='%<word>s']".freeze
    CHOICE_BUTTON_SELECTOR = "[data-choice]".freeze
    DATASOLUTION_CSS_TEMPLATE = "[data-solution*='%<word>s']".freeze
    ACTIVE_GAP_SELECTOR = "#{GAP_SELECTOR}[role=textbox][data-selector='active-gap']".freeze

    def finish_trainer(number_of_mistakes)
      while wordorder_selector_present?
        sleep SLEEP_SHORT
        if number_of_mistakes.positive?
          number_of_mistakes -= 1
          make_one_mistake
          sleep SLEEP_SHORT
        end

        cheat_item

        maybe_replay if @replay
        general_continue_button.click if general_continue_button_present?
      end
    end

    def get_active_gap
      wait_for_element(:css, ACTIVE_GAP_SELECTOR)
    end

    def get_sorted_words
      words = wait_for_elements(:css, CHOICE_BUTTON_SELECTOR)
      words.map(&:text).sort
    end

    def get_formatted_data_choice(word)
      Kernel.format(DATACHOICE_BUTTON_TEMPLATE, word: word.downcase)
    end

    def get_enabled_wordorderbutton(word)
      wait_for_element(:css, "#{get_formatted_data_choice(word)}:enabled")
    end

    def get_disabled_wordorderbutton(word)
      wait_for_element(:css, "#{get_formatted_data_choice(word)}:disabled")
    end

    def cheat_item
      get_ordered_choices.length.times do
        cheat_one
        sleep SLEEP_VERYSHORT
      end
      sleep SLEEP_MEDIUM if dictate?
    end

    def fill_in_correct_answer
      sleep SLEEP_LONG if dictate?

      get_ordered_choices.each do |choice|
        choice.click
        sleep SLEEP_VERYSHORT
      end
    end

    def fill_in_incorrect_answer
      get_ordered_choices.last.click
    end

    def make_one_mistake
      get_ordered_choices.last.click
    end

    private

    def wordorder_selector_present?
      sleep SLEEP_SHORT
      wait_for_element(:css, WORDORDER_INDICATOR_CSS, 6)
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

  end

end
