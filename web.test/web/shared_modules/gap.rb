module Pages

  module Gap

    GAP_SELECTOR = "[data-solution]".freeze
    DATASOLUTION_XPATH_TEMPLATE = "//*[@data-solution][contains(text(), '%<word>s}')]".freeze
    ACTIVE_GAP_SELECTOR = "#{GAP_SELECTOR}[role=textbox][data-selector='active-gap']".freeze
    CHOICE_BUTTON_SELECTOR = "[data-choice]".freeze
    INTERACTIVE_ITEM_SELECTOR_CSS = "[data-selector='interactive']".freeze
    NONINTERACTIVE_ITEM_SELECTOR_CSS = "[data-selector='non-interactive']".freeze

    FEEDBACK_SHEET_SELECTOR = "[data-selector='feedback-sheet']".freeze
    CONTINUE_SHEET_SELECTOR = "[data-selector='continue-sheet']".freeze
    GENERAL_CONTINUE_BUTTON_SELECTOR = "[data-selector='continue-button']".freeze

    GAP_FEEDBACK_CONTINUE_SELECTOR = "#{FEEDBACK_SHEET_SELECTOR} #{GENERAL_CONTINUE_BUTTON_SELECTOR}".freeze
    CONTINUE_BUTTON_SELECTOR = "#{CONTINUE_SHEET_SELECTOR} #{GENERAL_CONTINUE_BUTTON_SELECTOR}".freeze

    BODY_SELECTOR = "body".freeze
    ITEM_SELECTOR = "[data-item-type]".freeze

    SHOW_HINT_BUTTON_CSS = "button[data-selector='show-hint']".freeze
    SHOW_SOLUTION_BUTTON_CSS = "button[data-selector='show-solution']".freeze
    HINT_CHARACTER = "[data-selector='input-hint-char']".freeze
    SUBMIT_TIP = "[data-selector=tip-content]".freeze

    IOS_TIMEOUT = 15
    MAX_NUMBER_OF_LOOPS_PER_GAP = 7

    INTERACTION_CSS = "data-trainer-interaction".freeze
    WORDORDER_BUTTON_CSS = "[data-position][data-choice]".freeze

    def wait(*args)
      Selenium::WebDriver::Wait.new(*args)
    end

    def skip_gaps(cheat: false, until_solution: nil, auto_continue: true)
      current_trainer = wait.until { driver.find_element(:css, "[data-trainer-type]") }
      # rubocop:disable Metrics/BlockLength
      loop do
        begin
          gap = wait_for_next_gap(
            auto_dismiss_info_texts: true,
            auto_continue: auto_continue,
            current_trainer: current_trainer
          )

          if gap.nil?
            puts "this should only happen when a continue button "\
                 "was found but it was not clicked (auto_continue: false)"
            break
          end

          gap_solution = gap.attribute('data-solution')
          alternative_gap_solution = gap.attribute('data-alternative-solution')

          puts "Solution is \"#{gap_solution}\"."
          puts "Alternative solution is \"#{alternative_gap_solution}\"." if alternative_gap_solution.present?

          if until_solution && gap_solution == until_solution
            puts "Reached target gap."
            break
          end

          # alas, there is no cheating with shift escape on iPad
          if cheat
            puts "Cheating the gap."
            if wordorder?
              number_of_wordorder_words.times do
                cheat_one
              end
            else
              cheat_one
            end
          else
            puts "Solving the gap."
            gap.send_keys(gap_solution, :return)
          end
          maybe_replay if @replay

          # dialog with autoadvance has a 2 seconds delay when a non interactive
          # item is displayed thus this sleep, to avoid slowness, gaps would
          # be better filled one by one
          # sleep SLEEP_SHORT
        rescue Selenium::WebDriver::Error::TimeoutError
          puts "Found no more interactive elements."
          break
        rescue Selenium::WebDriver::Error::StaleElementReferenceError
          puts "Trainer no longer rendered."
          break
        end
      end
      # rubocop:enable Metrics/BlockLength
    end

    def cheat_one
      if webview?
        driver.execute_script %q{
          document.dispatchEvent(
            new KeyboardEvent(
              "keydown",
              { key: 'Escape', shiftKey: true, bubbles: true }
            )
          )
        }
      else
        driver.action.key_down(:shift).perform
        driver.action.send_keys(:escape).perform
        driver.action.key_up(:shift).perform
      end
    end

    def number_of_wordorder_words
      driver.find_elements(:css, WORDORDER_BUTTON_CSS).length
    end

    def wordorder?
      wait_for_element(:css, "[#{INTERACTION_CSS}]", 1).attribute(INTERACTION_CSS) == 'wordorder'
    rescue
      false
    end

    def gap_exists?
      wait_for_elements(:css, GAP_SELECTOR).length.positive?
    end

    def active_gap_exists?
      wait_for_elements(:css, ACTIVE_GAP_SELECTOR).length.positive?
    end

    def get_correct_solution
      wait_for_element(:css, ACTIVE_GAP_SELECTOR).attribute("data-solution")
    end

    def wait_for_next_gap(auto_dismiss_info_texts: false, auto_continue: false, current_trainer: nil)
      # rubocop:disable Metrics/BlockLength
      MAX_NUMBER_OF_LOOPS_PER_GAP.times do
        puts "Waiting for next gap."
        # Sleeping time here to allow previous interactive element to be properly removed
        # This prevents accidentally querying the same gap while it transitions to inactive
        # in steps like 'When I solve the gap' and 'Then I arrive at the next gap'
        sleep SLEEP_SHORT

        # Try and check if trainer is visible, if the reference has become stale
        # it will trigger StaleElementReferenceError
        current_trainer&.visible

        # Combined wait for any known interactive element
        selectors = {
          active_gap: ACTIVE_GAP_SELECTOR,
          feedback: GAP_FEEDBACK_CONTINUE_SELECTOR,
          continue_button: CONTINUE_BUTTON_SELECTOR
        }
        if @current_page.nil?
          element, name = wait_for_any(:css, selectors, 3)
        else
          element, name = @current_page.wait_for_any(:css, selectors, 3)
        end

        case name
        when :active_gap
          puts "Reached gap."
          return element
        when :feedback
          puts "Reached gap feedback."
          if auto_dismiss_info_texts
            puts "Dismissing the gap feedback."
            element.click
          else
            raise "Blocked by gap feedback. Cannot reach next gap."
          end
        when :continue_button
          puts "Reached continue button"
          if auto_continue
            puts "Continue button found, will click on the button"
            element.send_keys(:return)
          else
            puts "Continue button found, will return from this function and not click on the button"
            return nil
          end
        end
      end
      raise "no next gap found"
      # rubocop:enable Metrics/BlockLength
    end

    def gap_with_solution_active?(solution, timeout = @default_timeout)
      selector = "#{ACTIVE_GAP_SELECTOR}[data-solution='#{solution}']"
      wait_for_elements(:css, selector, timeout).length.positive?
    end

    def gap_at_index_active?(index, timeout = @default_timeout)
      gap_at_index = wait_for_elements(:css, GAP_SELECTOR, timeout)[index - 1]
      gap_at_index.attribute("data-selector") == "active-gap"
    rescue
      false
    end

    def item_at_index(index)
      wait_for_elements(:css, ITEM_SELECTOR)[index]
    end

    def item_at_index_interactive?(index)
      element = item_at_index(index)
      element.find_element(:css, "[data-selector='active-gap']")
      true
    rescue
      false
    end

    def count_active_gaps
      wait_for_elements(:css, ACTIVE_GAP_SELECTOR).length
    end

    def count_gaps
      wait_for_elements(:css, GAP_SELECTOR).length
    end

    def get_all_solutions
      wait_for_elements(:css, GAP_SELECTOR).map { |gap| gap.attribute("data-solution") }
    end

    def get_all_visible_solutions
      # there might be animations
      sleep SLEEP_SHORT
      wait_for_elements(:css, GAP_SELECTOR)
        .select(&:visible?)
        .map { |gap| gap.attribute("data-solution") }
    end

    def puzzlehelper_buttons_correct_status_for?(string, status)
      string.chars.each do |char|
        wait_for_element(:css, "[data-choice='#{char.downcase}']:#{status}")
      end
      true
    rescue
      false
    end

    def active_gap_visible?
      wait_for_elements(:css, ACTIVE_GAP_SELECTOR).empty?
    end

    def no_active_gap_visible?
      custom_wait(2).until do
        gaps = driver.find_elements(:css, ACTIVE_GAP_SELECTOR)
        gaps.empty?
      end
    end

    def get_gap
      wait_for_element(:css, GAP_SELECTOR)
    end

    # in a trainer where several items are displayed on one page (dialog, card),
    # get the index of the currently active item
    def active_item_index(items)
      return -1 if wait_for_elements(:css, ACTIVE_GAP_SELECTOR, 6).length.zero?

      # find and return the index of the item that was solved last
      elements = items.map do |element|
        element.find_elements(:css, "[data-selector='active-gap']").length.positive?
      end

      index = elements.index(true)
      if index.nil?
        raise "no currently active item found!"
      end

      index
    end

    def trainer_type
      driver.find_element(:css, "[data-trainer-type]").attribute('data-trainer-type')
    end

    def solved_item_full_text_equals?(expected_text)
      if trainer_type == 'dialog'
        # first/next item needs to appear (which is slow in dialog)
        wait_for_elements(:css, ACTIVE_GAP_SELECTOR, 6)
      end

      sleep SLEEP_SHORT
      items = wait_for_elements(:css, INTERACTIVE_ITEM_SELECTOR_CSS)
      current_item_index = active_item_index(items)

      # if the active item index is zero, then no item has been solved yet
      # and there is nothing to compare to
      raise "no solved item yet!" if current_item_index.zero?

      # rubocop:disable  Style/ConditionalAssignment
      if current_item_index == -1
        # all items solved, last item index it is
        solved_item_index = -1
      else
        # in any other case, we use index - 1
        solved_item_index = current_item_index - 1
      end
      # rubocop:enable  Style/ConditionalAssignment

      return true if items[solved_item_index].text == expected_text

      puts "expected '#{expected_text}', but found '#{items[solved_item_index].text}'"
      false
    end

    def any_item_visible_with_text?(expected_text)
      items = wait_for_elements(:css, NONINTERACTIVE_ITEM_SELECTOR_CSS)
      items.map(&:text).any? { |item_text| item_text == expected_text }
    end

    def text_in_gap_equals?(expected_text)
      # Gap element may be present but not yet updated with the latest text
      # Here we give some time to look for the gap containing the exact text before proceeding
      begin
        selector = Kernel.format(DATASOLUTION_XPATH_TEMPLATE, word: expected_text)
        wait_for_element(:xpath, selector)
      rescue Selenium::WebDriver::Error::TimeoutError
      end
      if get_gap.text == expected_text
        true
      else
        puts "expected '#{expected_text}', but found '#{get_gap.text}'"
        false
      end
    end

    def request_hint
      wait_for_element(:css, SHOW_HINT_BUTTON_CSS).click
    end

    def request_solution
      wait_for_element(:css, SHOW_SOLUTION_BUTTON_CSS).click
    end

    def get_hint_characters
      wait_for_elements(:css, HINT_CHARACTER).map(&:text).map { |c| c == "" ? " " : c }
    end

    def solution_letters_shuffled?(solution = nil)
      sleep SLEEP_SHORT
      solution ||= get_correct_solution
      characters = get_hint_characters
      # 1. must have same length
      return false if characters.length != solution.length
      # 2. joined together as strings must not be equal
      return false if characters.join == solution

      # 3. sorted and joined together must contain same characters
      solution.chars.sort.join == characters.sort.join
    end

    def solution_letters_ordered?(solution = nil)
      solution ||= get_correct_solution
      get_hint_characters.join == solution
    end

    def hint_button_shown?
      wait_for_elements(:css, SHOW_HINT_BUTTON_CSS, 2).length.positive?
    end

    def solution_button_shown?
      wait_for_elements(:css, SHOW_SOLUTION_BUTTON_CSS, 2).length.positive?
    end

    def clear_gap
      wait_for_element(:css, ACTIVE_GAP_SELECTOR).clear
    end

    def hit_key_on_gap(key)
      wait_for_element(:css, ACTIVE_GAP_SELECTOR).send_keys(key.to_sym)
    end

    def fill_in_text(string)
      wait_for_element(:css, ACTIVE_GAP_SELECTOR).send_keys(string)
    end

    def submit_hint_visible?(timeout = @default_timeout)
      submit_tip = wait_for_elements(:css, SUBMIT_TIP, timeout).first

      return false if submit_tip.nil?

      submit_tip.displayed?
    end

    def focus_on_body
      wait_for_element(:css, BODY_SELECTOR).click
    end

  end

end
