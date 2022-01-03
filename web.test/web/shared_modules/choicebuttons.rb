require_relative "gap"

module Pages

  module Choicebuttons

    include Gap

    CHOICEBUTTONS_INDICATOR_CSS = "[data-trainer-interaction='choose'][data-trainer-puzzlehelper='false']".freeze
    ACTIVE_GAP_SELECTOR = "[data-solution][role=textbox][data-selector='active-gap']".freeze
    CHOICEBUTTON_CORRECT_CHOICE_CSS = "button[data-correct='true']".freeze
    CHOICEBUTTON_INCORRECT_CHOICE_CSS = "button[data-correct='false']".freeze
    CHOICEBUTTON_ACTIVEGAP_CSS = "[data-selector='active-gap']".freeze
    TRAINER_TYPE_CSS = "[data-trainer-type]".freeze
    TRAINER_INTERACTION_CSS = "[data-trainer-interaction]".freeze
    ALTERNATIVE_SOLUTION = "[data-solution-alternative][data-selector='active-gap']".freeze
    SOLVED_GAP = "[data-selector='interactive'] [role='textbox']:not([data-selector='active-gap'])".freeze
    BUTTON_TEMPLATE = "[data-focus-on-key='%<button_number>s']".freeze
    CHOICEBUTTON_CSS = "[data-choice]".freeze
    COLORS = {
      black: {
        selector: CHOICEBUTTON_CSS,
        colorcode: "rgb(190, 206, 221)"
      },
      red: {
        selector: CHOICEBUTTON_INCORRECT_CHOICE_CSS,
        colorcode: "rgb(255, 77, 77)"
      },
      green: {
        selector: CHOICEBUTTON_CORRECT_CHOICE_CSS,
        colorcode: "rgb(68, 205, 200)"

      }
    }.freeze

    def finish_trainer(number_of_mistakes)
      wait.until { trainer_interaction == 'choose' }
      current_trainer = [trainer_type, trainer_interaction]
      loop do

        wait.until { active_gap_present? }

        if number_of_mistakes.positive?
          click_incorrect_choicebutton
          sleep 1.5
          number_of_mistakes -= 1
        end

        # some items have more than one gap
        while active_gap_present?(2.5)
          click_correct_choicebutton
          sleep 0.2
        end

        # wait until info text and sound replay are done
        sleep SLEEP_LONG

        # maybe click replay button and advance to next item
        if general_continue_button_present?(2.5)
          maybe_replay if @replay
          general_continue_button.click
        end

        # if by clicking on the general continue button, we ended up on the
        # next trainer, we exit the loop
        break if current_trainer != [trainer_type, trainer_interaction]
      end
    end

    def click_correct_choicebutton
      wait_for_element(:css, CHOICEBUTTON_CORRECT_CHOICE_CSS).click
    end

    def click_incorrect_choicebutton
      wait_for_elements(:css, CHOICEBUTTON_INCORRECT_CHOICE_CSS).sample.click
    end

    def click_alternative_choicebutton
      sleep SLEEP_SHORT
      solution = wait_for_element(:css, ALTERNATIVE_SOLUTION).attribute('data-solution-alternative')
      wait_for_elements(:css, "[data-correct='true']").each do |element|
        data_choice = strip_html(element.attribute('data-choice'))
        if data_choice == solution
          element.click
          break
        end
      end
    end

    def fill_in_correct_answer
      sleep SLEEP_SHORT
      click_correct_choicebutton
    end

    def fill_in_incorrect_answer
      sleep SLEEP_SHORT
      click_incorrect_choicebutton
    end

    def fill_in_alternative_answer
      sleep SLEEP_SHORT
      click_alternative_choicebutton
    end

    def trainer_type
      wait_for_element(:css, TRAINER_TYPE_CSS, 2).attribute('data-trainer-type')
    rescue
      "no trainer detectable"
    end

    def trainer_interaction
      wait_for_element(:css, TRAINER_INTERACTION_CSS, 2).attribute('data-trainer-interaction')
    rescue
      "no interaction type detectable"
    end

    def active_gap_present?(timeout = @default_timeout)
      wait_for_elements(:css, ACTIVE_GAP_SELECTOR, timeout).length.positive?
    end

    def count_choices(answer_type)
      selectors = {
        correct: "[data-choice][data-correct='true']",
        incorrect: "[data-choice][data-correct='false']",
        alternative: "[data-solution-alternative]"
      }
      wait_for_elements(:css, selectors[answer_type.to_sym], 2).size
    end

    def button_html(button_number)
      selector = Kernel.format(BUTTON_TEMPLATE, button_number: button_number)
      wait_for_element(:css, selector).html
    end

    def bold_word_visible_on_choicebutton?(bold_word, button_number)
      button_html(button_number).include? "<b>#{bold_word}</b>"
    end

    def italic_word_visible_on_choicebutton?(italic_word, button_number)
      button_html(button_number).include? "<i>#{italic_word}</i>"
    end

    def choicebutton_color_is?(color)
      element = wait_for_element(:css, COLORS[color][:selector])
      border_style = element.css_value('border')
      border_style.include? COLORS[color][:colorcode]
    end

    # the two actions, clicking and looking at the element must be in one step
    # and one function because they must happen as quickly after each other as
    # possible
    def choicebutton_color_change_to?(color)
      element = wait_for_element(:css, COLORS[color][:selector])
      element.click
      custom_wait(2).until do
        border_style = element.css_value('border')
        border_style.include? COLORS[color][:colorcode]
      end
    rescue
      false
    end

  end

end
