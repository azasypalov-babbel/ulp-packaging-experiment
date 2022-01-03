module Pages

  module ProgressBar

    PROGRESSBAR_PROGRESSTEXT_CSS = ".loy-progress-counter".freeze
    PROGRESSBAR_ITEM_CSS = "span.loy-progress-bar__item".freeze

    def progress_bar_item
      wait_for_elements(:css, PROGRESSBAR_ITEM_CSS).first
    end

    def progress_bar_at_percent?(expected_percentage)
      get_progress_bar_coloring_percentage == expected_percentage
    end

    def get_progress_numbers
      progress_numbers = get_progress_numbers_without_implicit_coloring_check
      if @check_progress_bar
        expected_percentage = get_progress_bar_coloring_expected_percentage(progress_numbers)
        assert progress_bar_at_percent?(expected_percentage)
      end
      progress_numbers
    end

    def get_progress_numbers_without_implicit_coloring_check
      progress_text = wait_for_element(:css, PROGRESSBAR_PROGRESSTEXT_CSS)
      current_index = progress_text.text.split("/").first.to_i
      trainers_total = progress_text.text.split("/").last.to_i
      { current_index: current_index, trainers_total: trainers_total }
    end

    def finish_trainer_and_check_end_score(number_of_mistakes, end_score_left, end_score_right)
      before = get_progress_numbers
      assert before[:current_index].zero?
      assert before[:trainers_total] == end_score_right
      finish_trainer(number_of_mistakes)
      after = get_progress_numbers
      assert after[:current_index] == end_score_left
      assert after[:trainers_total] == end_score_right
    end

    def set_check_progress_bar_number_increses
      @check_progress_bar = true
    end

    private

    def check_progress_bar_number(expected_number)
      assert get_progress_numbers[:current_index] == expected_number
    end

    def questions_left_in_review?
      get_progress_numbers[:current_index] < get_progress_numbers[:trainers_total]
    end

    def get_progress_bar_coloring_percentage
      return 0 unless progress_bar_item.visible?
      if driver.current_url.include? "review"
        # progress bar coloring percentage is based on items in one trainer
        return progress_bar_item.attribute("style").match(/width: (\d{1,3}\.?)/)[1].to_i
      end

      # the calculation for lessons is based on number of finished trainers
      progress_bar_parts = wait_for_elements(:css, PROGRESSBAR_ITEM_CSS, 2)
      raise if progress_bar_parts.empty?

      done = progress_bar_parts.select { |x| x.attribute("style").match(/(\d+)/)[1].to_i >= 100 }
      not_done = progress_bar_parts.select { |x| x.attribute("style").include? "width: 0%;" }
      assert progress_bar_parts.length == done.length + not_done.length
      (done.length.to_f / progress_bar_parts.length * 100).to_i
    end

    def get_progress_bar_coloring_expected_percentage(progress_numbers = nil)
      progress_numbers ||= get_progress_numbers_without_implicit_coloring_check
      trainers_total = progress_numbers[:trainers_total].to_f
      # rubocop:disable Style/ConditionalAssignment
      if driver.current_url.include?("review") || general_continue_button_present? || lesson_endpage?
        current_index = progress_numbers[:current_index].to_f
      else
        current_index = (progress_numbers[:current_index].to_i - 1).to_f
      end
      # rubocop:enable Style/ConditionalAssignment
      (current_index / trainers_total * 100).to_i
    end

  end

end
