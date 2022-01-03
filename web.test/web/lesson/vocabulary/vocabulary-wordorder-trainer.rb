require_relative "vocabulary-base"

module Pages

  class VocabularyWordorderTrainer < VocabularyBase

    include Wordorder

    VOCAB_WORDORDER_ITEMPOSITION_CSS = "data-position".freeze

    def initialize
      super
      @page_selector_css = Pages::Wordorder::WORDORDER_INDICATOR_CSS
    end

    def get_ordered_choices
      choices = wait_for_elements(:css, "button[#{VOCAB_WORDORDER_ITEMPOSITION_CSS}]")
      choices.sort_by { |button| button.attribute(VOCAB_WORDORDER_ITEMPOSITION_CSS) }
    end

  end

end
