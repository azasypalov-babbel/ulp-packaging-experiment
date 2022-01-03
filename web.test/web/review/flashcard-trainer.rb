require_relative "review-base"

module Pages

  class FlashcardTrainer < ReviewBase

    FLASHCARD_INDICATOR_CSS = "*[data-selector='flashcard-title']".freeze
    FLASHCARD_BIGPICTURE_CSS = "div[src*='images']".freeze
    FLASHCARD_YESBUTTON_CSS = "*[data-solution='Yes']".freeze
    FLASHCARD_NOBUTTON_CSS = "*[data-solution='No']".freeze

    def initialize
      super
      @page_selector_css = FLASHCARD_INDICATOR_CSS
      @check_progress_bar = false
      @use_keyboard = false
    end

    def finish_trainer(number_of_mistakes)
      current_number = 1
      while questions_left_in_review?
        wait_for_element(:css, FLASHCARD_BIGPICTURE_CSS).click
        sleep SLEEP_SHORT
        if number_of_mistakes.positive?
          answer_question(answer_correctly: false)
          number_of_mistakes -= 1
        else
          answer_question(answer_correctly: true)
        end
        sleep SLEEP_SHORT
        next unless @check_progress_bar

        puts "checking that progress bar increases after every item"
        check_progress_bar_number(current_number)
        current_number += 1
      end
    end

    def fill_in_correct_answer
      answer_question(answer_correctly: true)
    end

    private

    def answer_regular_way(answer_correctly)
      wait_for_element(:css, FLASHCARD_BIGPICTURE_CSS).click
      sleep SLEEP_SHORT
      if answer_correctly
        wait_for_element(:css, FLASHCARD_YESBUTTON_CSS).click
      else
        wait_for_element(:css, FLASHCARD_NOBUTTON_CSS).click
      end
    end

    def answer_with_keyboard(answer_correctly)
      # KEYBOARD SHORTCUTS ARE HARDCODED TO
      # 1 => big picture
      # 2 => No
      # 3 => Yes
      hit_key_with_text("1")
      sleep SLEEP_SHORT
      if answer_correctly
        hit_key_with_text("3")
      else
        hit_key_with_text("2")
      end
    end

  end

end
