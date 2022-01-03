module Pages

  module Transliteration

    TRANSLITERATION_INSTRUCTIONS = "[data-selector='transliteration-instructions']".freeze
    TRANSLITERATION_TABLE = "[data-selector='transliteration-table']".freeze
    TRANSLITERATION_TOGGLE = "[data-selector='transliteration-toggle']".freeze

    def get_instruction_text
      wait_for_element(:css, TRANSLITERATION_INSTRUCTIONS).text
    end

    def transliteration_table_open?(timeout = @default_timeout)
      wait_for_element(:css, TRANSLITERATION_TABLE, timeout).visible?
    rescue
      false
    end

    def toggle_transliteration_table
      wait_for_element(:css, TRANSLITERATION_TOGGLE).click
    end

    def transliteration_table_content
      wait_for_element(:css, TRANSLITERATION_TABLE, 2).html
    end

  end

end
