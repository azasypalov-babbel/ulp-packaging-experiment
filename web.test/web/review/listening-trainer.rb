require_relative "review-base"

module Pages

  class ListeningTrainer < ReviewBase

    include ReplayFunctionality

    LISTENING_INDICATOR_CSS = "*[data-selector='listening-title']".freeze
    LISTENING_CORRECTANSWER_CSS = "*[data-selector='correct-item']".freeze
    LISTENING_WRONGANSWER_CSS = "*[data-selector='distractor']".freeze
    LISTENING_CHOICEBUTTONS_CONTAINER_CSS = "[data-selector='choicelist-container'][data-has-attempt='false']".freeze
    LISTENING_PLAYBUTTON_CSS = "[data-selector='play-button']".freeze

    def initialize
      super
      @page_selector_css = LISTENING_INDICATOR_CSS
      @check_progress_bar = false
      test_shortcuts_visibility
      @use_keyboard = false
      @replay = :listenagain_play
    end

    def finish_trainer(number_of_mistakes)
      current_number = 1
      while questions_left_in_review?
        if number_of_mistakes.positive?
          answer_question(answer_correctly: false)
          number_of_mistakes -= 1
        else
          maybe_replay
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
      wait_for_element(:css, LISTENING_CORRECTANSWER_CSS).click
    end

    def fill_in_incorrect_answer
      wait_for_elements(:css, LISTENING_WRONGANSWER_CSS).sample.click
    end

    def sound_icon_is_playing?
      sound_playing = {
        'is-playing': true,
        'has-ended': false
      }
      current_state = wait_for_element(:css, LISTENING_PLAYBUTTON_CSS).attribute('data-sound')
      sound_playing[current_state]
    end

    def wait_for_choice_list_items
      buttons = wait_for_elements(:css, "#{LISTENING_CHOICEBUTTONS_CONTAINER_CSS} button")
      assert buttons.length >= 2
      assert buttons.map(&:visible?).all?(true)
      # at this point, there might still be a button animation, making the
      # buttons unclickable
    end

    private

    def current_question
      # the question text can change between rounds, so there is
      # no use comparing it
      ""
    end

    def answer_with_keyboard(answer_correctly)
      selector = if answer_correctly
                   "#{LISTENING_CORRECTANSWER_CSS} span span"
                 else
                   "#{LISTENING_WRONGANSWER_CSS} span span"
                 end
      shortcuts = wait_for_elements(:css, selector)
      assert shortcuts.length == 1
      hit_key_with_text(shortcuts.first.text)
      sleep SLEEP_VERYSHORT
      hit_return_key
    end

    def answer_regular_way(answer_correctly)
      if answer_correctly
        fill_in_correct_answer
        wait_for_element(:css, FEEDBACK_SUCCESSMESSAGE_CSS, 2)
      else
        fill_in_incorrect_answer
        wait_for_element(:css, FEEDBACK_FAILUREMESSAGE_CSS, 2)
      end
      sleep SLEEP_VERYSHORT
      general_continue_button.click
    end

  end

end
