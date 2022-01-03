require_relative "dialog-base"

module Pages

  class DialogDictatefillinTrainer < DialogBase

    include Fillin
    include Dictate

    def initialize
      super
      @page_selector_css = Pages::Fillin::FILLIN_INDICATOR_CSS + Pages::Dictate::DICTATE_INDICATOR_CSS
      @parameters_for_next_gap = { auto_dismiss_info_texts: true, auto_continue: true }
    end

  end

end
