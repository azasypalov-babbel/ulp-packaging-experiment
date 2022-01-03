require_relative "../trainer"

module Pages

  class DictateBase < TrainerBase

    include InfoText
    include ItemTranslation
    include ReplayFunctionality
    include Dictate

    def initialize
      super
      assert dictate?
      @replay = :listening_play
    end

  end

end
