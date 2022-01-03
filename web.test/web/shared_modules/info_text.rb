module Pages

  module InfoText

    INFO_TEXT_CSS = "[data-selector='info-text']".freeze
    DISMISS_INFO_CSS = "[data-selector='dismiss-info-texts']".freeze
    VIEW_ALL_BUTTON_CSS = "[data-selector='view-all-info-texts']".freeze
    CLOSE_X_CSS = "[data-selector='close-x-button']".freeze
    INFOTEXTS_SIDEBOX_CSS = "[data-selector='info-texts-sidebox']".freeze
    INFOTEXTS_TOPBOX_CSS = "[data-selector='info-texts-wrapper']".freeze

    def top_info_text_text
      wait_for_element(:css, INFOTEXTS_TOPBOX_CSS).text
    end

    def top_info_text_shown?
      wait_for_elements(:css, INFOTEXTS_TOPBOX_CSS).length.positive?
    end

    def top_info_text_disappeared?
      custom_wait(2).until do
        driver.find_elements(:css, INFOTEXTS_TOPBOX_CSS).empty?
      end
      true
    rescue
      false
    end

    def view_all_button_visible?(timeout = @default_timeout)
      wait_for_elements(:css, VIEW_ALL_BUTTON_CSS, timeout).length.positive?
    end

    def view_all_button
      wait_for_element(:css, VIEW_ALL_BUTTON_CSS)
    end

    def expected_count_visible?(expected_number)
      custom_wait(20).until do
        expected_number == count_info_texts
      end
      true
    rescue
      false
    end

    def count_info_texts
      eles = wait_for_elements(:css, VIEW_ALL_BUTTON_CSS)
      return 0 if eles.empty?

      pattern = /.* \((\d)\)/
      eles.first.text.match(pattern)[1].to_i
    end

    def close_info_texts_button
      wait_for_element(:css, DISMISS_INFO_CSS)
    end

    def x_close_button
      wait_for_element(:css, CLOSE_X_CSS)
    end

    def sidebox(timeout = @default_timeout)
      wait_for_element(:css, INFOTEXTS_SIDEBOX_CSS, timeout)
    end

    def sidebox_visible?(timeout = @default_timeout)
      eles = wait_for_elements(:css, INFOTEXTS_SIDEBOX_CSS, timeout)
      return false if eles.empty?

      eles.all?(&:visible?)
    end

  end

end
