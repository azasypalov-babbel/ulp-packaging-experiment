require_relative "dialog-base"

module Pages

  class DialogDictatechoiceTrainer < DialogBase

    include Choicebuttons
    include Dictate

    def initialize
      super
      @page_selector_css = Pages::Choicebuttons::CHOICEBUTTONS_INDICATOR_CSS + Pages::Dictate::DICTATE_INDICATOR_CSS
    end

  end

end
