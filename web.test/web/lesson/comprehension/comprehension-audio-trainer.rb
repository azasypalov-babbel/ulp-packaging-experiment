require_relative "comprehension-base"

module Pages

  class ComprehensionAudioTrainer < ComprehensionBase

    include ReplayFunctionality
    include Choicebuttons
    include ItemTranslation

    COMPREHENSION_AUDIO_INDICATOR_CSS = "[data-trainer-dictate='true']".freeze
    COMPREHENSION_PLAYER_BACK_ENABLED_CSS = "[data-selector='player-back-button-enabled']".freeze
    COMPREHENSION_PLAYER_BACK_DISABLED_CSS = "[data-selector='player-back-button-disabled']".freeze
    COMPREHENSION_PLAYER_TOOLTIP_CSS = "[data-selector='tip-content']".freeze
    COMPREHENSION_PLAYER_FORWARD_ENABLED_CSS = "[data-selector='player-forward-button-enabled']".freeze
    COMPREHENSION_PLAYER_FORWARD_DISABLED_CSS = "[data-selector='player-forward-button-disabled']".freeze
    COMPREHENSION_NUGGET_CSS = "[data-selector='player-nugget']".freeze

    PLAY_STATE = {
      play: "initial",
      pause: "playing",
      replay: "completed",
      paused: "paused"
    }.freeze

    def initialize
      super
      @page_selector_css = COMPREHENSION_AUDIO_INDICATOR_CSS
      @replay = :player_play
    end

    def finish_trainer(number_of_mistakes)
      wait_for_element(:css, PLAYER_PLAY_CSS).click
      # sleep 0.5
      wait_for_element(:css, "#{COMPREHENSION_ARROWUP_CSS}[data-button-active='true']").click
      # sleep 0.5
      wait_for_element(:css, COMPREHENSION_QUESTIONSHEETEXPANDED_CSS)
      count = wait_for_element(:css, COMPREHENSION_QUESTIONCOUNT_CSS).attribute('data-question-count')
      count.to_i.times do

        if number_of_mistakes.positive?
          number_of_mistakes -= 1
          fill_in_wrong_answer
        end

        fill_in_correct_answer
        sleep 1.5
      end
    end

    def click_audio_button(type)
      return click_player_play_button if type == "audio"

      selector = playbutton_selector_for(type)
      wait_for_element(:css, selector).click
    end

    def playbutton_selector_for(type)
      "#{PLAYER_PLAY_CSS}[data-playstate='#{PLAY_STATE[type.to_sym]}']"
    end

    def wait_for_replay_button
      wait.until { driver.find_element(:css, playbutton_selector_for("replay")) }
    end

    def sound_player_with_symbol?(symbol)
      selector = playbutton_selector_for(symbol)
      wait_for_elements(:css, selector).length.positive?
    end

    def small_sound_button_visible?(enabled, direction, timeout = nil)
      timeout ||= @default_timeout
      constname = "COMPREHENSION_PLAYER_#{direction.upcase}_#{enabled.upcase}_CSS"
      selector = Pages::ComprehensionAudioTrainer.const_get(constname)
      wait_for_elements(:css, selector, timeout).length.positive?
    end

    def count_sound_nuggets(color)
      selector = "#{COMPREHENSION_NUGGET_CSS}[data-nugget-color='#{color}']"
      wait_for_elements(:css, selector).select(&:visible).length
    end

    def tooltip_visible?
      wait_for_elements(:css, COMPREHENSION_PLAYER_TOOLTIP_CSS, 2).select(&:visible).length.positive?
    end

    def sound_forward_button
      wait_for_element(:css, COMPREHENSION_PLAYER_FORWARD_ENABLED_CSS)
    end

    def sound_backward_button
      wait_for_element(:css, COMPREHENSION_PLAYER_BACK_ENABLED_CSS)
    end

  end

end
