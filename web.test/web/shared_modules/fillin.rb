require_relative "gap"

module Pages

  module Fillin

    include Gap

    FILLIN_INDICATOR_CSS = "div[data-trainer-interaction='write'][data-trainer-puzzlehelper='false']".freeze
    INPUT_CURRENT_SOLUTION = "input[data-solution]:not([data-solution='']):enabled".freeze
    ALTERNATIVE_SOLUTION = "[data-solution-alternative][data-selector='active-gap']".freeze
    FEEDBACK_SHEET_CSS = "[data-selector='feedback-sheet']".freeze

    def finish_trainer(number_of_mistakes)
      number_of_mistakes.times do
        sleep SLEEP_SHORT
        gap = wait_for_next_gap(@parameters_for_next_gap)
        # enter wrong solution and hit return key
        gap.send_keys("Ö-$%", :return)
        # feedback sheet shows up and we choose 'continue' to get to the next item
        puts "making a mistake in gap #{gap.attribute('data-solution')}"
        sleep 0.5
        hit_return_on_white_continue_button if has_feedback_sheet?(1)
        sleep 1
        # another feedback sheet is shown with the general orange continue button
        general_continue_button.click if general_continue_button_present?(2)
        sleep 2.5
      end
      skip_gaps(cheat: true) if wait_for_elements(:css, FILLIN_INDICATOR_CSS, 2).length.positive?
    end

    def fill_in_correct_answer
      input_field = wait_for_next_gap(auto_dismiss_info_texts: false, auto_continue: false)
      solution = get_current_solution
      solve_one_word(input_field, solution)
    end

    def fill_in_incorrect_answer
      input_field = wait_for_next_gap(auto_dismiss_info_texts: false, auto_continue: false)
      solve_one_word(input_field, "totally wrong Ö-$%")
    end

    def fill_in_alternative_answer
      input_field = wait_for_next_gap(auto_dismiss_info_texts: false, auto_continue: false)
      solution = wait_for_element(:css, ALTERNATIVE_SOLUTION).attribute('data-solution-alternative')
      solve_one_word(input_field, solution)
    end

    def get_current_solution
      wait_for_element(:css, INPUT_CURRENT_SOLUTION).attribute('data-solution')
    end

    private

    def solve_one_word(input_field, solution)
      input_field.send_keys(solution)
    end

    def has_feedback_sheet?(timeout)
      timeout ||= @default_timeout
      wait_for_element(:css, FEEDBACK_SHEET_CSS, timeout)
      true
    rescue
      false
    end

  end

end
