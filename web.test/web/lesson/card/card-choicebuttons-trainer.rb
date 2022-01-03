require_relative "card-base"

module Pages

  class CardChoicebuttonsTrainer < CardBase

    include Choicebuttons

    def initialize
      super
      @page_selector_css = Pages::Choicebuttons::CHOICEBUTTONS_INDICATOR_CSS
    end

  end

end
