require_relative "dictate-base"

module Pages

  class DictatePuzzlehelperTrainer < DictateBase

    include Puzzlehelper

    def initialize
      super
      @page_selector_css = Pages::Puzzlehelper::PUZZLEHELPER_INDICATOR_CSS
      @parameters_for_next_gap = { auto_dismiss_info_texts: true, auto_continue: true }
    end

  end

end
