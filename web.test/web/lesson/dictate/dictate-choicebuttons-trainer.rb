require_relative "dictate-base"

module Pages

  class DictateChoicebuttonsTrainer < DictateBase

    include Choicebuttons

    def initialize
      super
      @page_selector_css = Pages::Choicebuttons::CHOICEBUTTONS_INDICATOR_CSS
    end

    def finish_trainer(number_of_mistakes)
      wait.until { trainer_interaction == 'choose' }
      current_trainer = [trainer_type, trainer_interaction]
      loop do
        sleep 2.5 if dictate?

        begin
          wait.until { active_gap_present? }
        rescue
          ## there can be elements that do not require user action
          general_continue_button.click
          next
        end

        if number_of_mistakes.positive?
          click_incorrect_choicebutton
          sleep SLEEP_SHORT
          number_of_mistakes -= 1
        end

        # some items have more than one gap
        while active_gap_present?(1)
          click_correct_choicebutton
          sleep 0.2
        end

        # for until info text and sound replay are done
        sleep SLEEP_LONG

        # maybe click replay button and advance to next item
        if general_continue_button_present?(2)
          maybe_replay if @replay
          general_continue_button.click
        end

        # if by clicking on the general continue button, we ended up on the
        # next trainer, we exit the loop
        break if current_trainer != [trainer_type, trainer_interaction]
      end
    end

  end

end
