require_relative "dictate-base"

module Pages

  class DictateWordorderTrainer < DictateBase

    include Wordorder

    DICTATE_WORDORDER_ITEMS_CSS = "div.tool-box button".freeze
    DICTATE_WORDORDER_SOLUTION_BUTTON_XPATH = "//div[@class='dictate-slide']//a[@class='btn']".freeze
    DICTATE_WORDORDER_ITEMPOSITION_CSS = "data-position".freeze

    def initialize
      super
      @page_selector_css = Pages::Wordorder::WORDORDER_INDICATOR_CSS
    end

    def get_ordered_choices
      choices = wait_for_elements(:css, "button[#{DICTATE_WORDORDER_ITEMPOSITION_CSS}]")
      choices.sort_by { |button| button.attribute(DICTATE_WORDORDER_ITEMPOSITION_CSS) }
    end

    private

    def word_order_selector_present?
      wait_for_element(:css, DICTATEBASE_INDICATOR_CSS, 3)
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def get_sortable_elements
      wait_for_elements(:css, DICTATE_WORDORDER_ITEMS_CSS)
    end

  end

end
