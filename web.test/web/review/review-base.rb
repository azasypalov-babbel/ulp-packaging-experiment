require_relative "../lesson/trainer"

module Pages

  class ReviewBase < TrainerBase

    include Feedback

    SHORTCUTTEXT_CSS = "[data-selector='keyboard-shortcut-hint']".freeze
    SHORTCUTSBUTTON_CSS = "[data-selector='reveal-shortcuts-button']".freeze
    ITEM_TEXT_CSS = "[data-selector='%<type>s-language-text']".freeze

    def answer_question(answer_correctly:)
      if @use_keyboard
        wait_for_element(:css, SHORTCUTSBUTTON_CSS).click unless shortcuts_visible?
        answer_with_keyboard(answer_correctly)
      else
        answer_regular_way(answer_correctly)
      end
      sleep SLEEP_VERYSHORT
    end

    def shortcuts_visible?
      wait_for_element(:css, SHORTCUTTEXT_CSS, 2).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def item_text(type)
      # type is either "learn" or "display" language
      types = wait_for_elements(:css, format(ITEM_TEXT_CSS, type: type))
      raise if types.empty?

      types.map(&:text).join(";;")
    end

    def current_question
      item_text "display"
    end

    def current_solution
      item_text "learn"
    end

    def test_shortcuts_visibility
      toggle_button = wait_for_element(:css, SHORTCUTSBUTTON_CSS)
      if shortcuts_visible?
        # toggle shortcuts off in case they were on
        toggle_button.click
      end
      # toggle on and test
      toggle_button.click
      assert shortcuts_visible?
      # toggle off and test
      toggle_button.click
      assert !shortcuts_visible?
    end

  end

end
