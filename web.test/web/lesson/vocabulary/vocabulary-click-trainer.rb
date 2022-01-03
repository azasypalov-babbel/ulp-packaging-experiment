require_relative "vocabulary-base"

module Pages

  class VocabularyClickTrainer < VocabularyBase

    TRAINER_SELECTOR_CSS = "div.page-vocabulary-click".freeze
    CARD_CSS = "div.card".freeze
    QUESTION_WRAPPER_CSS = "p.question-wrapper".freeze

    def initialize
      super
      @page_selector_css = TRAINER_SELECTOR_CSS
      @translation_supported = true
    end

    def finish_trainer(number_of_mistakes)
      sleep SLEEP_SHORT
      answers = get_all_answers_hash
      get_number_of_questions.times do
        question = wait.until { driver.find_element(:css, QUESTION_WRAPPER_CSS) }
        wait.until { question.visible? }
        if number_of_mistakes.positive?
          sleep SLEEP_SHORT
          answers.reject { |word, _| word == question.text }.values.first.click
          number_of_mistakes -= 1
          sleep SLEEP_SHORT
        end
        element = answers[question.text]
        element.click
        sleep SLEEP_SHORT
        answers.reject! { |_, value| value == element }
      end

      general_continue_button.click
    end

    def fill_in_correct_answer
      question = wait.until { driver.find_element(:css, QUESTION_WRAPPER_CSS) }
      wait.until { question.visible? }
      cards = wait.until { driver.find_elements(:css, CARD_CSS) }
      cards.each do |element|
        cleanup_answer(element.attribute('answer')).each do |word|
          if question.text == word
            element.click
            return nil
          end
        end
      end
      sleep SLEEP_SHORT
      raise "No correct answer found"
    end

    private

    def get_number_of_questions
      driver.find_elements(css: CARD_CSS).length
    end

    def get_all_answers_hash
      answers = Hash.new
      driver.find_elements(css: CARD_CSS).each do |element|
        answer = element.attribute('answer')
        words = cleanup_answer(answer)
        words.each do |word|
          answers[word] = element
        end
      end
      answers
    end

  end

end
