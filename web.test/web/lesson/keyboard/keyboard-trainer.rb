require_relative "../trainer"

module Pages

  class KeyboardTrainer < TrainerBase

    include Fillin
    include InfoText
    include Transliteration

    KEYBOARDWRITE_INDICATOR_CSS = "div[data-trainer-type='keyboard']".freeze
    TOGGLE_KEYBOARD_CSS = "#bottom-layout-mount-point button".freeze

    def initialize
      super
      @page_selector_css = KEYBOARDWRITE_INDICATOR_CSS
      @parameters_for_next_gap = { auto_dismiss_info_texts: true, auto_continue: false }
    end

    def fill_in_correct_answer
      input_field = wait_for_next_gap(auto_dismiss_info_texts: false, auto_continue: false)
      rus_letter = get_current_solution
      solve_one_word(input_field, rus_letter)
    end

    def fill_in_alternative_answer
      input_field = wait_for_next_gap(auto_dismiss_info_texts: false, auto_continue: false)
      rus_letter = get_current_solution
      unless transliteration_table_open?(2)
        toggle_transliteration_table
      end
      solution = wait_for_element(:css, "[data-target='#{rus_letter}']").attribute('data-source')
      solve_one_word(input_field, solution)
    end

    def solve_one_word(input_field, solution)
      input_field.send_keys(solution)
    end

  end

end
