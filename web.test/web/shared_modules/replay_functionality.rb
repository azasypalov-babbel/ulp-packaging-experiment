require "selenium-webdriver"

module Pages

  module ReplayFunctionality

    B3_REPLAY_BUTTON_CSS = "a.replay".freeze
    LISTENAGAIN_REPLAY_BUTTON_CSS = "[data-selector='item-sound-replay-wrapper']".freeze
    B3_PLAY_BUTTON_CSS = "div.play-button-visible".freeze
    PLAY_BUTTON_CSS = "*[data-selector='play-button']".freeze
    VOCAB_ITEM_IMAGE = "[data-selector='image-with-sound']".freeze
    PLAYER_PLAY_CSS = "[data-selector='soundplayer-big-button']".freeze

    def player_play_button
      wait_for_element(:css, PLAYER_PLAY_CSS)
    end

    def play_button
      wait_for_elements(:css, B3_PLAY_BUTTON_CSS).last
    end

    def replay_button(timeout = 5)
      wait_for_element(:css, B3_REPLAY_BUTTON_CSS, timeout)
    rescue Selenium::WebDriver::Error::TimeoutError
      play_button
    end

    def listenagain_replay_button
      buttons = wait_for_elements(:css, LISTENAGAIN_REPLAY_BUTTON_CSS).select(&:visible?)
      if buttons.length == 1
        return buttons.first
      end

      buttons[-2]
    end

    def listening_play_button
      wait_for_element(:css, PLAY_BUTTON_CSS)
    end

    def vocab_item_image
      wait_for_element(:css, VOCAB_ITEM_IMAGE)
    end

    def click_player_play_button
      player_play_button.click
    end

    def click_play_button
      play_button.click
    rescue Selenium::WebDriver::Error::UnknownError, Selenium::WebDriver::Error::WebDriverError
      puts "couldn't click on the play button due to #{$!}"
    end

    def click_replay_button
      replay_button.click
    rescue Selenium::WebDriver::Error::StaleElementReferenceError
      puts "couldn't click on the replay button due to #{$!}"
    end

    def click_listenagain_replay_button
      listenagain_replay_button.click
    end

    def click_listening_play_button
      listening_play_button.click
    end

    def click_vocab_item_image
      vocab_item_image.click
    end

    def maybe_replay
      return if Kernel.rand(0..1).zero?

      puts "Clicking on replay button"
      case @replay
      when :listenagain
        click_listenagain_replay_button
      when :replay
        click_replay_button
      when :play
        click_play_button
      when :listening_play
        click_listening_play_button
      when :vocab_item_image
        click_vocab_item_image
      when :player_play
        click_player_play_button
      end
      sleep SLEEP_SHORT
    end

  end

end
