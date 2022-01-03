require_relative "comprehension-base"

module Pages

  class ComprehensionTextTrainer < ComprehensionBase

    include ItemTranslation
    include Choicebuttons

    COMPREHENSION_TEXT_INDICATOR_CSS = "[data-trainer-dictate='false']".freeze

    def initialize
      super
      @page_selector_css = COMPREHENSION_TEXT_INDICATOR_CSS
    end

    def finish_trainer(number_of_mistakes)
      wait_for_element(:css, "#{COMPREHENSION_ARROWUP_CSS}[data-button-active='true']").click
      sleep 0.5
      wait_for_element(:css, COMPREHENSION_QUESTIONSHEETEXPANDED_CSS)
      count = wait_for_element(:css, COMPREHENSION_QUESTIONCOUNT_CSS).attribute('data-question-count')
      count.to_i.times do

        if number_of_mistakes.positive?
          number_of_mistakes -= 1
          fill_in_wrong_answer
          sleep 1.5
        end

        fill_in_correct_answer
        sleep 1.5
      end
    end

  end

end
