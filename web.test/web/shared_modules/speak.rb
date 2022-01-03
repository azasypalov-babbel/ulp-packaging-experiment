require_relative "gap"

module Pages

  module Speak

    MIC_BUTTON_CSS = "[data-selector='mic-button']".freeze
    CURRENT_ITEM_CSS = "#bottom-layout-mount-point [data-selector='speak-item']".freeze
    MIC_TOGGLE_BUTTON_CSS = "[data-selector='mic-toggle']".freeze
    TRY_AGAIN_SELECTOR_CSS = "[data-selector='try-again-button']".freeze

    def finish_trainer(number_of_mistakes)
      number_of_mistakes.times do
        # after 5 seconds, the negative answer should fire automatically.
        # make sure that the flag for fake speak is turned on: is_web_speech_mock
        custom_wait(6).until do
          general_continue_button_present?
        end
        general_continue_button.click
      end

      until general_continue_button_present?(3)
        custom_wait(2).until { !mic_button.nil? }
        cheat_one
        sleep SLEEP_LONG
      end

      general_continue_button.click
    end

    def cheat_one
      driver.action.key_down(:shift).perform
      driver.action.send_keys(:escape).perform
      driver.action.key_up(:shift).perform
    end

    def mic_button(timeout = @default_timeout)
      wait_for_elements(:css, MIC_BUTTON_CSS, timeout).first
    end

    def tooltip
      wait_for_elements(:css, "[data-selector='tip-content']").first
    end

    def mic_toggle_button
      wait_for_element(:css, MIC_TOGGLE_BUTTON_CSS)
    end

    def try_again_button
      wait_for_element(:css, TRY_AGAIN_SELECTOR_CSS)
    end

    def click_on_mic_toggle_button
      mic_toggle_button.click
    end

    def current_item_in_bottom_mount_point
      wait_for_element(:css, CURRENT_ITEM_CSS)
    end

    def feedback?(expected_style)
      styles = {
        none: 'default',
        red: 'error',
        green: 'success'
      }
      actual_state = current_item_in_bottom_mount_point.attribute('data-item-state')

      actual_state == styles[expected_style]
    end

    def mic_button_visible_with_state?(expected_state)
      wait.until { mic_button.visible? && mic_button.attribute('data-appearance').downcase == expected_state }
    rescue
      false
    end

    def tooltip_visible_with_text?(expected_text)
      wait.until { tooltip.visible? && tooltip.text == expected_text }
    rescue
      false
    end

  end

end
