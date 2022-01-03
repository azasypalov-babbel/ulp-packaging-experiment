require_relative "../web_base"
require_relative "../shared_modules"

module Pages

  class TrainerBase < WebBase

    attr_accessor :solutions

    include ProgressBar
    include Gap
    include Feedback

    TRANSLITERATION_TOGGLE_CSS = "[data-selector='transliteration-toggle']".freeze
    TRAINER_SKIP_FORWARD_CSS = "[data-selector='forward-button']".freeze
    TRAINER_SKIP_BACKWARD_CSS = "[data-selector='backward-button']".freeze

    def initialize
      super()
      # no page should ever display these babbel formatting characters
      assert !formatting_characters_visible_on_page?
      @use_keyboard = false
      @check_progress_bar = true
    end

    def current_trainer_name_as_symbol
      to_s.split(":")[2].to_sym
    end

    def lesson_endpage?
      false
    end

    def set_solutions(solution_string)
      @solutions = solution_string.split("/")
    end

    def transliteration_toggle
      wait_for_element(:css, TRANSLITERATION_TOGGLE_CSS)
    end

    def skip_trainer(direction)
      selector = TrainerBase.const_get("TRAINER_SKIP_#{direction.upcase}_CSS")
      wait_for_element(:css, selector).click
    end

    private

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

    def wait_for_method_to_not_return_nil_or_false(method, *args)
      count = 3
      while count.positive?
        count -= 1
        sleep SLEEP_MEDIUM
        result = send(method, *args)
        return result if result
      end
      raise "method #{method} was called 3 times and only returned nil or false"
    end

    def cleanup_answer(answer)
      # This function takes an answer as returned by the API with
      # all the (())*| etc and cleans it up.
      # @return array of words
      # TODO: this will probably have to be extended to match more
      #       cases at some point
      x = answer.gsub(/[()*]/, '').split('|')
      if x.length > 1 && x.any? { |w| w.ends_with? '!' }
        y = x.select { |w| w.ends_with? '!' }
        (x - y).each { |w| y << "#{w}!" }
        return y
      end
      x
    end

  end  # end class trainer base

end  # end module
