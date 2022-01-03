require_relative "../trainer"

module Pages

  class VocabularyBase < TrainerBase

    VOCABULARYBASE_INDICATOR_CSS = "[data-trainer-type='vocabulary']".freeze

    include InfoText
    include ItemTranslation
    include ReplayFunctionality
    include Dictate

    def initialize
      super
      assert driver.find_element(css: VOCABULARYBASE_INDICATOR_CSS)
      @replay = :vocab_item_image
    end

  end

end
