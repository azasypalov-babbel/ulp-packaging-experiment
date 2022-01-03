require_relative "dialog-base"

module Pages

  class DialogPuzzlehelperTrainer < DialogBase

    include Puzzlehelper

    def initialize
      super
      @page_selector_css = Pages::Puzzlehelper::PUZZLEHELPER_INDICATOR_CSS
      @parameters_for_next_gap = { auto_dismiss_info_texts: true, auto_continue: true }
    end

  end

end
