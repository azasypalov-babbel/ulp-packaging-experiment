require_relative "../trainer"

module Pages

  class VocabularySpeakTrainer < TrainerBase

    VOCABULARYSPEAK_INDICATOR_CSS = "div.vocabulary-speak".freeze

    def initialize
      super
      @page_selector_css = VOCABULARYSPEAK_INDICATOR_CSS
      @check_progress_bar = false
    end

    def finish_trainer(_args)
      sleep SLEEP_SHORT
      progress_bar_start_index = get_progress_numbers[:current_index]
      while can_continue? progress_bar_start_index
        general_continue_button.click
        sleep SLEEP_SHORT
      end
    end

    private

    def can_continue?(progress_bar_start_index)
      current_index = get_progress_numbers_without_implicit_coloring_check[:current_index]
      (current_index == progress_bar_start_index) && general_continue_button_present?
    end

  end

end
