require_relative "review-base"

module Pages

  class B3SpokenReviewTrainer < ReviewBase

    SPOKEN_REVIEW_SELECTOR = "[data-trainer-type='spokenreview'][data-interaction-type='speak']".freeze

    def initialize
      super
      @page_selector_css = SPOKEN_REVIEW_SELECTOR
    end

  end

  class B4SpokenReviewTrainer < B3SpokenReviewTrainer

    GOT_IT_BUTTON_CSS = "button[data-selector='got-it']".freeze

    def got_it_button
      wait_for_element(:css, GOT_IT_BUTTON_CSS)
    end

  end

end
