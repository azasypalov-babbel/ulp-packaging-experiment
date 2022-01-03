require_relative "gap"

module Pages

  module Puzzlehelper

    include Gap

    PUZZLEHELPER_INDICATOR_CSS = "div[data-trainer-interaction='write'][data-trainer-puzzlehelper='true']".freeze
    CHARACTER_BUTTON_CSS_TEMPLATE = "[data-choice='%<character>s']:enabled".freeze
    DONE_BUTTON_SELECTOR = "[data-selector='done-button']".freeze
    INPUT_CURRENT_SOLUTION = "[data-selector='active-gap'][data-solution]".freeze
    DELETE_BUTTON_SELECTOR = "[data-selector='delete-button']".freeze

    def finish_trainer(number_of_mistakes)
      number_of_mistakes.times do
        sleep SLEEP_SHORT
        wait_for_next_gap(@parameters_for_next_gap)
        current_solution = get_current_solution
        solve_one_word_with_puzzlehelper_buttons(current_solution.chars[1..3].join)
        puts "making a mistake at gap '#{current_solution}'"
        click_on_done_button
        sleep SLEEP_SHORT
        general_continue_button.click
        sleep SLEEP_SHORT
        general_continue_button.click if general_continue_button_present?(1)
      end
      skip_gaps(cheat: true)
    end

    def click_on_delete_button(count)
      button = wait_for_element(:css, DELETE_BUTTON_SELECTOR)
      count.times do
        button.click
      end
    end

    def click_on_done_button
      done_button.click
    end

    def done_button
      wait_for_element(:css, DONE_BUTTON_SELECTOR)
    end

    def fill_in_correct_answer
      fill_in_correct_answer_with_puzzlehelper
    end

    def fill_in_correct_answer_with_puzzlehelper
      solve_one_word_with_puzzlehelper_buttons(get_current_solution)
    end

    def fill_in_incorrect_answer
      input_field.send_keys(get_current_solution.reverse)
    end

    def fill_in_incorrect_answer_with_puzzlehelper
      solve_one_word_with_puzzlehelper_buttons(get_current_solution.reverse)
    end

    def fill_in_text_with_puzzlehelper(text)
      solve_one_word_with_puzzlehelper_buttons(text)
    end

    def get_current_solution
      wait_for_element(:css, INPUT_CURRENT_SOLUTION).attribute('data-solution')
    end

    private

    def input_field
      wait_for_next_gap(auto_dismiss_info_texts: false, auto_continue: false)
    end

    def solve_one_word(input_field, solution)
      input_or_puzzlehelper = %i[puzzlehelper input].sample
      if input_or_puzzlehelper == :input
        input_field.send_keys(solution)
      else
        solve_one_word_with_puzzlehelper_buttons(solution)
      end
    end

    def solve_one_word_with_puzzlehelper_buttons(solution)
      solution.chars.each do |character|
        selector = Kernel.format(CHARACTER_BUTTON_CSS_TEMPLATE, character: character.downcase)
        wait_for_element(:css, selector).click
      end
    end

  end

end
