require_relative "vocabulary-base"

module Pages

  class VocabularyChoicebuttonsTrainer < VocabularyBase

    include Choicebuttons

    def initialize
      super
      @page_selector_css = Pages::Choicebuttons::CHOICEBUTTONS_INDICATOR_CSS
    end

  end

end
