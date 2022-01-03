require_relative "../trainer"

module Pages

  class CardBase < TrainerBase

    CARDBASE_INDICATOR_CSS = "div[data-trainer-type='card']".freeze

    include InfoText
    include ItemTranslation

    def initialize
      super
      assert driver.find_element(css: CARDBASE_INDICATOR_CSS)
    end

  end

end
