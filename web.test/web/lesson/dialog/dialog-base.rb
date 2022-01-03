require_relative "../trainer"

module Pages

  class DialogBase < TrainerBase

    include InfoText
    include ItemTranslation
    include ReplayFunctionality

    DIALOGBASE_INDICATOR_CSS = "[data-trainer-type='dialog']".freeze
    DIALOG_PHRASE_CSS = "[data-item-type='phrase']".freeze
    DIALOGBASE_SPEAKER_AVATAR_CSS = "[data-selector*='speaker-avatar']".freeze

    def initialize
      super
      assert driver.find_element(css: DIALOGBASE_INDICATOR_CSS)
      @replay = :listenagain
    end

    def dialog_rows
      wait_for_elements(:css, DIALOG_PHRASE_CSS)
    end

    def speaker_avatars
      wait_for_elements(:css, DIALOGBASE_SPEAKER_AVATAR_CSS)
    end

  end

end
