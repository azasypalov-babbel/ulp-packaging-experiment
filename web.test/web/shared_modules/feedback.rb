module Pages

  module Feedback

    FEEDBACK_TRY_AGAIN_SELECTOR = "[data-selector='try-again-button']".freeze
    FEEDBACK_FAILUREMESSAGE_CSS = "[data-selector='feedback-sheet'][data-solved='false']".freeze
    FEEDBACK_SUCCESSMESSAGE_CSS = "[data-selector='feedback-sheet'][data-solved='true']".freeze
    FEEDBACK_SHEET_SELECTOR_CSS = "[data-selector='feedback-sheet']".freeze
    TEXT_MISTAKEN_SELECTOR_CSS = "[data-gap-feedback='true'][data-solved='false'][data-mistaken='true']".freeze
    TYPO_SELECTOR_CSS = "[data-gap-feedback='true'][data-solved='true'][data-mistaken='false']".freeze
    SPEAK_MISTAKEN_SELECTOR_CSS = "[data-selector='speak-item'][data-item-state='error']".freeze

    def hit_return_on_white_continue_button
      button = wait_for_element(:css, '#bottom-layout-mount-point [data-selector="continue-button"]')
      button.send_keys(:return)
    end

    def click_on_white_continue_button
      button = wait_for_element(:css, '#bottom-layout-mount-point [data-selector="continue-button"]')
      button.click
    end

    def click_try_again_button
      button = wait_for_element(:css, FEEDBACK_TRY_AGAIN_SELECTOR)
      button.click
    end

    def hit_return_key_on_try_again_button
      button = wait_for_element(:css, FEEDBACK_TRY_AGAIN_SELECTOR)
      button.send_keys(:return)
    end

    def gap_solved?
      wait_for_elements(:css, "[data-gap-feedback][data-solved='true']", 2).lenght.positive?
    end

    def feedback_disappeared?
      custom_wait(2).until do
        driver.find_elements(:css, "[data-gap-feedback]").empty?
      end
    end

    def dismiss_feedback
      general_continue_button.click
    end

    def dismiss_feedback_with_keyboard
      hit_return_key
    end

    def gap_mistaken?
      text_gap_mistaken = wait_for_elements(:css, TEXT_MISTAKEN_SELECTOR_CSS, 2).length.positive?
      return text_gap_mistaken if text_gap_mistaken

      wait_for_elements(:css, SPEAK_MISTAKEN_SELECTOR_CSS, 2).length.positive?
    end

    def gap_typo?
      wait_for_elements(:css, TYPO_SELECTOR_CSS, 2).length.positive?
    end

    def feedback_message_type
      feedback_div = wait_for_element(:css, FEEDBACK_SHEET_SELECTOR_CSS)
      if feedback_div.attribute('data-solved') == 'true'
        'positive'
      elsif feedback_div.attribute('data-mistaken') == 'true'
        'negative'
      end
    end

  end

end
