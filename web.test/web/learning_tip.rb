require_relative "web_base"

module Pages

  class LearningTip < WebBase

    LEARNINGTIP_SELECTOR_PREFIX = ".loy-learning-tip-screen".freeze
    LEARNINGTIP_SELECTOR_CSS = "div#{LEARNINGTIP_SELECTOR_PREFIX}".freeze
    LEARNINGTIP_GOTITBUTTON_CSS = "#{LEARNINGTIP_SELECTOR_PREFIX} button".freeze
    LEARNINGTIP_TIPTEXT_CSS = "#{LEARNINGTIP_SELECTOR_PREFIX}__text".freeze
    LEARNINGTIP_TITLE_CSS = "#{LEARNINGTIP_SELECTOR_PREFIX}__title".freeze
    LEARNINGTIP_ICON_CSS = "#{LEARNINGTIP_SELECTOR_PREFIX}__icon".freeze

    def initialize
      super()
      @page_selector_css = LEARNINGTIP_SELECTOR_CSS
    end

    def click_got_it_button
      got_it_button.click
    end

    def got_it_button
      wait_for_element(:css, LEARNINGTIP_GOTITBUTTON_CSS)
    end

    def all_required_elements_are_visible?
      [LEARNINGTIP_ICON_CSS, LEARNINGTIP_TITLE_CSS,
       LEARNINGTIP_TIPTEXT_CSS, LEARNINGTIP_GOTITBUTTON_CSS].all? do |selector|
        element = driver.find_element(css: selector)
        element.visible?
      end
    end

  end  # end class start

end  # end module
