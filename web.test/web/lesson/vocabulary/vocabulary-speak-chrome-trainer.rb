require_relative "vocabulary-base"

module Pages

  class VocabularySpeakChromeTrainer < VocabularyBase

    INTERACTION_INDICATOR_CSS = "[data-interaction-type='speak']".freeze

    def initialize
      super
      @page_selector_css = INTERACTION_INDICATOR_CSS
      @check_progress_bar = false
    end

    def finish_trainer(_args)
      current_trainer = wait.until { driver.find_element(:css, @page_selector_css) }

      sleep SLEEP_SHORT
      while can_continue? current_trainer
        general_continue_button.click
        sleep SLEEP_SHORT
      end
    end

    private

    def can_continue?(current_trainer)
      begin
        current_trainer.click
        true
      rescue Selenium::WebDriver::Error::StaleElementReferenceError
        puts "Trainer no longer rendered."
        false
      end
    end

  end

end
