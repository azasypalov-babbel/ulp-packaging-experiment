require_relative "../trainer"

module Pages

  class MatchingTrainer < TrainerBase

    include InfoText

    MATCHING_SELECTOR_CSS = "[data-trainer-type='matching'][data-trainer-interaction='choose']".freeze
    MATCHING_QUESTION_CSS = "[data-item-type='base']".freeze
    MATCHING_UNMATCHED_XPATH = "[@data-matched-item='false']".freeze
    MATCHING_ANSWER_CSS = "[data-item-type='option']".freeze
    MATCHING_ANSWER_XPATH = "[@data-item-type='option']".freeze

    # an unmatched option item that has a child with a given data-solution-id
    # returns the parent element
    CORRECT_CHOICEBUTTON_XPATH = "//*[@data-solution-id='%<correct_id>s']/../../"\
                                 "*#{MATCHING_ANSWER_XPATH}#{MATCHING_UNMATCHED_XPATH}".freeze
    # an unmatched option item that has a child with a data-solution-id not matching the 'correct id'
    # returns the parent element
    WRONG_CHOICEBUTTON_XPATH = "//*[@data-solution-id!='%<correct_id>s']/../../"\
                               "*#{MATCHING_ANSWER_XPATH}#{MATCHING_UNMATCHED_XPATH}".freeze
    # correct option item (matched or unmatchec) - returns the child element
    CORRECT_OPTION_XPATH = "//*#{MATCHING_ANSWER_XPATH}/*[@data-solution-id='%<correct_id>s']".freeze

    MATCHING_TOGGLE_CSS = "[data-selector='translation-toggle-inline']".freeze
    MATCHING_TOGGLE_XPATH = "//*[@data-item-type='option']/span[text()='%<text>s']/.."\
                            "//*[@data-selector='translation-toggle-inline']".freeze
    MATCHING_TOOLTIP_CSS = "[data-selector='tip-content']".freeze
    COLORS = {
      red: {
        selector: WRONG_CHOICEBUTTON_XPATH,
        colorcode: "rgb(255, 77, 77)"
      },
      green: {
        selector: CORRECT_CHOICEBUTTON_XPATH,
        colorcode: "rgb(68, 205, 200)"
      }
    }.freeze

    def initialize
      super
      @page_selector_css = MATCHING_SELECTOR_CSS
    end

    def finish_trainer(number_of_mistakes)
      wait_for_elements(:css, MATCHING_QUESTION_CSS).each do |element|
        correct_id = element.attribute('data-solution-id')
        if number_of_mistakes.positive?
          wait.until { active_gap_exists? }
          click_wrong_choicebutton(correct_id)
          number_of_mistakes -= 1
        end
        sleep SLEEP_SHORT
        wait.until { active_gap_exists? }
        click_correct_choicebutton(correct_id)
      end
    end

    def active_gap_exists?
      # rubocop:disable Layout/MultilineMethodCallIndentation
      wait.until do
        active_unmatched_bases = wait_for_elements(:css, MATCHING_QUESTION_CSS, 10)
          .select(&:visible)
          .select do |base|
            base.attribute('data-matched-item') == "false" && base.attribute('data-clickable-item') == "true"
          end
        # rubocop:enable Layout/MultilineMethodCallIndentation
        active_unmatched_bases.length.positive?
      end
      sleep 1
      true
    rescue
      false
    end

    # the naming 'choicebutton' here and further down is to be able to match the
    # function names in the steps that are usually used in choicebuttons interaction type
    def click_alternative_choicebutton
      correct_id = correct_solution_id
      option_text = wait_for_elements(:xpath, Kernel.format(CORRECT_OPTION_XPATH, correct_id: correct_id))
                    .last
                    .text
      valid_options = wait_for_elements(:css, MATCHING_ANSWER_CSS).select { |e| e.text == option_text }
      alternative_option = valid_options.reject do |option|
        option.find_elements(:css, "span[data-solution-id='#{correct_id}']").length.positive?
      end
      # just to be double sure we are clicking the alternative solution
      assert !alternative_option.first.html.include?(correct_solution_id)
      alternative_option.first.click
    end

    # the two actions, clicking and looking at the element must be in one step
    # and one function because they must happen as quickly after each other as
    # possible
    def choicebutton_color_change_to?(color)
      selector = COLORS[color][:selector]
      button = wait_for_element(:xpath, Kernel.format(selector, correct_id: correct_solution_id))
      button.click

      wait.until do
        sleep 0.1
        border_color = button.css_value('border-color')
        border_color.include? COLORS[color][:colorcode]
      end
    end

    def fill_in_alternative_answer
      click_alternative_choicebutton
    end

    def fill_in_correct_answer
      click_correct_choicebutton
    end

    def fill_in_incorrect_answer
      click_wrong_choicebutton
    end

    def solution_value(correct_id)
      element_with_solution = wait_for_elements(:css, "#{MATCHING_ANSWER_CSS} span")
                              .map { |e| [e, e.attribute('data-solution-id')] }
                              .select { |pair| pair[1] == correct_id }
                              .pop
      element_with_solution[0].text
    end

    def click_correct_choicebutton(correct_id = nil)
      wait_for_element(
        :xpath, Kernel.format(CORRECT_CHOICEBUTTON_XPATH, correct_id: correct_id || correct_solution_id)
      ).click
    end

    def click_wrong_choicebutton(correct_id = nil)
      # the wrong choicebutton must have a different ID and a different value
      # than the current base item
      correct_id ||= correct_solution_id
      value = solution_value(correct_id)
      selector = Kernel.format(WRONG_CHOICEBUTTON_XPATH, correct_id: correct_id)
      eles = wait_for_elements(:xpath, selector).reject { |e| e.text == value }
      eles.sample.click
    end

    def item_has_translation_toggle?(text, negate)
      eles = wait_for_elements(:xpath, Kernel.format(MATCHING_TOGGLE_XPATH, text: text), 2)
      # the toggle may exist but it must be invisible
      invisible = eles.map { |ele| ele.css_value("visibility") == "hidden" }.all? true
      return true if (!invisible && !negate) || (invisible && negate)

      false
    end

    def count_visible_translation_toggles
      wait_for_elements(:css, MATCHING_TOGGLE_CSS).select(&:visible).length
    end

    def count_visible_tooltips
      wait_for_elements(:css, MATCHING_TOOLTIP_CSS).select(&:visible).length
    end

    def mouse_over_translation_toggle_at(index)
      toggle = wait_for_elements(:css, MATCHING_TOGGLE_CSS).select(&:visible)[index - 1]
      mouse_over_element(toggle)
    end

    def tooltip
      wait_for_elements(:css, MATCHING_TOOLTIP_CSS).select(&:visible).first
    end

    private

    def correct_solution_id
      base_selector = "#{MATCHING_QUESTION_CSS}[data-matched-item='false'] [data-solution-id]"
      wait_for_elements(:css, base_selector)
        .select(&:visible)
        .first
        .attribute('data-solution-id')
    end

  end

end
