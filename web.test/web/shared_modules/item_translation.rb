module Pages

  module ItemTranslation

    TRANSLATE_ICON_CSS = "button[data-selector='translation-toggle']".freeze
    ITEM_TRANSLATION_CSS = ".item-translation, [data-selector='item-translation']".freeze
    TITLE_CSS = "h1".freeze

    def translation_string
      wait_for_element(:css, ITEM_TRANSLATION_CSS, 1)
    end

    def translation_toggle
      wait_for_element(:css, TRANSLATE_ICON_CSS, 1)
    end

    def translation_string_visible?
      translation_string.visible?
    rescue
      false
    end

    def translation_toggle_visible?
      translation_toggle.visible?
    rescue
      false
    end

  end

end
