require_relative "dialog-base"

module Pages

  class DialogSpeakTrainer < DialogBase

    include Speak

    DIALOG_SPEAK_SELECTOR_CSS = "[data-trainer-type='dialog'][data-trainer-interaction='speak']"\
                                "[data-trainer-puzzlehelper='false']".freeze

    def initialize
      super
      @page_selector_css = DIALOG_SPEAK_SELECTOR_CSS
    end

  end

end
