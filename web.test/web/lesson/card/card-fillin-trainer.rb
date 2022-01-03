require_relative "card-base"

module Pages

  class CardFillinTrainer < CardBase

    include Fillin

    def initialize
      super
      @page_selector_css = Pages::Fillin::FILLIN_INDICATOR_CSS
      @parameters_for_next_gap = { auto_dismiss_info_texts: true, auto_continue: false }
    end

  end

end
