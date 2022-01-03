require_relative "card-base"

module Pages

  class CardPuzzlehelperTrainer < CardBase

    include Puzzlehelper

    def initialize
      super
      @page_selector_css = Pages::Puzzlehelper::PUZZLEHELPER_INDICATOR_CSS
      @parameters_for_next_gap = { auto_dismiss_info_texts: true, auto_continue: false }
    end

  end

end
