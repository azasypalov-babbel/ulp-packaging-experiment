require_relative "trainer_end_content_unlocked"

module Pages

  class TrainerEndContentLocked < TrainerEndContentUnlocked

    TRAINEREND_LOCKED_IDENTIFYER_CSS = "h1.loy-lesson-end-screen-feedback-message__text".freeze
    TRAINEREND_LOCKED_ACCESSCONTENTTEXT_CSS = "div.loy-lesson-end-screen-feedback-actions p".freeze
    TRAINEREND_LOCKED_ACCESSCONTENTBUTTON_CSS = "[data-selector='access-content-button']".freeze

    def initialize
      super()
      @page_selector_css = TRAINEREND_LOCKED_IDENTIFYER_CSS
      check_correct_elements_are_present
    end

    def access_content_button_leads_to_prices_page?
      access_content_button.click
      sleep SLEEP_LONG
      driver.current_url.include? 'prices'
    rescue Net::ReadTimeout
      driver.current_url.include? 'prices'
    end

    def access_content_button
      wait_for_element(:css, TRAINEREND_LOCKED_ACCESSCONTENTBUTTON_CSS)
    end

    private

    def check_correct_elements_are_present
      [TRAINEREND_LOCKED_ACCESSCONTENTTEXT_CSS,
       TRAINEREND_LOCKED_ACCESSCONTENTBUTTON_CSS].each do |selector|
        wait_for_element(:css, selector, SHORT_TIMEOUT)
      end
      assert !correct_errors_button_visible?
      assert !return_home_button_visible?
      assert number_of_visible_buttons == 1
    end

  end

end
