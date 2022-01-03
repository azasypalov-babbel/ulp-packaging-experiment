module Pages

  module Dictate

    DICTATE_INDICATOR_CSS = "[data-trainer-dictate='true']".freeze

    def dictate?
      wait_for_element(:css, DICTATE_INDICATOR_CSS, 2)
      true
    rescue
      false
    end

  end

end
