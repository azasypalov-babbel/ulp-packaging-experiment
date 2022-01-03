require_relative "dialog-base"

module Pages

  class DialogChoicebuttonsTrainer < DialogBase

    include Choicebuttons

    def initialize
      super
      @page_selector_css = Pages::Choicebuttons::CHOICEBUTTONS_INDICATOR_CSS
    end

  end

end
