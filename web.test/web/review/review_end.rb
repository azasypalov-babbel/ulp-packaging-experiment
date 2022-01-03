require_relative "../web_base"
require_relative "../shared_modules"

module Pages

  class ReviewEnd < WebBase

    include ProgressBar

    REVIEWEND_IDENTIFYER_CSS = "div.loy-review-end-screen".freeze
    REVIEWEND_ANSWEREDITEMSCONTAINER_CSS = ".loy-card.loy-card--".freeze
    REVIEWEND_CLOSEBTN_CSS = "[data-selector='close-button']".freeze
    REVIEWEND_REVIEW_MORE_BTN_CSS = "[data-selector='review-more-button']".freeze
    REVIEWEND_PURGEBUTTON_CSS = "[data-selector='correct-errors-button']".freeze
    REVIEWEND_DISABLEDNEXTBTN_CSS = "button.btn.next-items[disabled=disabled]".freeze
    REVIEWEND_FEEDBACKMSG_CSS = "h1[data-feedback-grade]".freeze
    REVIEW_ITEM_CORRECT_CSS = "[data-review='item-correct']".freeze
    REVIEW_ITEM_INCORRECT_CSS = "[data-review='item-incorrect']".freeze
    REVIEW_ITEM_CSS = "[data-review]".freeze

    def initialize
      super()
      wait_for_element(:css, REVIEWEND_IDENTIFYER_CSS, 15)
      @page_selector_css = REVIEWEND_IDENTIFYER_CSS
      assert !formatting_characters_visible_on_page?(REVIEWEND_IDENTIFYER_CSS)
    end

    def feedback_message_grade
      wait_for_element(:css, REVIEWEND_FEEDBACKMSG_CSS).attribute("data-feedback-grade")
    end

    def get_number_of_correct_answers
      wait_for_elements(:css, REVIEW_ITEM_CORRECT_CSS).length
    end

    def get_number_of_wrong_answers
      wait_for_elements(:css, REVIEW_ITEM_INCORRECT_CSS).length
    end

    def close_button
      wait_for_element(:css, REVIEWEND_CLOSEBTN_CSS)
    end

    def close_button_visible?
      wait_for_element(:css, REVIEWEND_CLOSEBTN_CSS, 2).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def correct_errors_button
      wait_for_element(:css, REVIEWEND_PURGEBUTTON_CSS)
    end

    def review_more_button
      wait_for_element(:css, REVIEWEND_REVIEW_MORE_BTN_CSS)
    end

    def disabled_review_more_button
      wait_for_element(:css, REVIEWEND_DISABLEDNEXTBTN_CSS)
    end

    def click_review_more_button
      review_more_button.click
    end

    def click_correct_errors_button
      correct_errors_button.click
    end

    def correct_errors_button_visible?
      wait_for_element(:css, REVIEWEND_PURGEBUTTON_CSS, 2).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def review_more_button_visible?
      wait_for_element(:css, REVIEWEND_REVIEW_MORE_BTN_CSS, 2).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def get_number_of_correctable_items
      matches = /\((\d{1,2})\)/.match correct_errors_button.text
      matches[1]
    end

    def click_on_review_end_button(button_type)
      case button_type
      when "Close"
        close_button.click
      when "Next"
        review_more_button.click
      end
    end

    def correct_box_visible?
      wait_for_element(:css, "#{REVIEWEND_ANSWEREDITEMSCONTAINER_CSS}correct", 2).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def incorrect_box_visible?
      wait_for_element(:css, "#{REVIEWEND_ANSWEREDITEMSCONTAINER_CSS}incorrect", 2).visible?
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

  end

end
