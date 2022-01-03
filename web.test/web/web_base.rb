require_relative "../features/support/pages/base"

module Pages

  class WebBase < Base

    NAVIGATION_BABBEL_LOGO_XPATH = "//div[contains(@class, 'nav-collapse')]//span[@class='logo']".freeze
    GENERAL_CONTINUE_BUTTON_SELECTOR = "[data-selector='continue-button']".freeze
    FORMATTING_CHARS_REGEX = /(["{*}<>]|\(\(|\)\))/.freeze
    TRAINER_SELECTOR_CSS = "[data-trainer-type][data-trainer-interaction]".freeze

    def babbel_logo
      wait_for_element(:id, NAVIGATION_BABBEL_LOGO_ID)
    end

    def set_use_keyboard_shortcuts
      @use_keyboard = true
    end

    def hit_return_on_general_continue_button
      general_continue_button.send_keys(:return)
    end

    def general_continue_button(waiting_time = 2)
      wait_for_first_visible_element_of_list(:css, GENERAL_CONTINUE_BUTTON_SELECTOR, waiting_time)
    end

    def general_continue_button_present?(waiting_time = 2)
      general_continue_button(waiting_time)
      true
    rescue Selenium::WebDriver::Error::TimeoutError
      false
    end

    def strip_html(sentence)
      sentence.gsub(/<.>/, '').gsub(%r(</.>), '')
    end

    def formatting_characters_visible_on_page?(selector = TRAINER_SELECTOR_CSS)
      puts "formatting characters check on page #{self.class.to_s.gsub(/Pages::/, '')}"
      # if match is nil, then there are NO formatting characters in the text
      unless wait_for_element(:css, selector).text.match(FORMATTING_CHARS_REGEX).nil?
        puts "there is formatting in the text of this page underneath selector #{selector}"
        puts wait_for_element(:css, selector).text
        return true
      end
      false
    rescue Selenium::WebDriver::Error::TimeoutError
      # if we don't find the element at selector, then there is no formatting
      # within that element and we return false
      false
    end

    def formatting_visible_in_text?(match_string, item_type)
      possible_elements = {
        # new textbox - interactive phrase
        phrase_interactive: "[data-item-type='phrase'] [data-selector='interactive']",
        # new textbox - noninteractive phrase
        phrase_noninteractive: "[data-item-type='phrase'] [data-selector='non-interactive']",
        # new textbox - interactive task
        task_interactive: "[data-item-type='task'] [data-selector='interactive']",
        # new textbox - noninteractive task
        task_noninteractive: "[data-item-type='task'] [data-selector='non-interactive']",
        # new textbox - translation
        translation: "[data-selector='item-translation']",
        # new textbox - title
        title: "[data-selector='title']",
        # info text in blue top bar
        info_text: "[data-selector='info-text']",
        # Review end page - incorrect items box
        incorrect_box: "[data-review='item-incorrect']",
        # Review end page - correct items box
        correct_box: "[data-review='item-correct']"
      }
      selector = possible_elements[item_type.tr(" ", "_").to_sym]
      all_html_of_given_type = wait_for_elements(:css, selector).map(&:html).join(" ")
      !all_html_of_given_type.match(match_string).nil?
    rescue
      false
    end

    def bold_word_visible_in_text?(bold_word, item_type)
      # match_string = "<b>#{bold_word}</b>"
      match_string = %r(<b><?i?>?#{bold_word}<?/?i?>?</b>)
      formatting_visible_in_text?(match_string, item_type)
    end

    def italic_word_visible_in_text?(italic_word, item_type)
      # match_string = "<i>#{italic_word}</i>"
      match_string = %r(<i><?b?>?#{italic_word}<?/?b?>?</i>)
      formatting_visible_in_text?(match_string, item_type)
    end

  end

end
