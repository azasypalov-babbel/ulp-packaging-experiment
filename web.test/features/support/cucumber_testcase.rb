require "cucumber/core/test/case"

module Cucumber

  module Core

    module Test

      class Case

        def last_testcase_in_feature?
          feature.feature_elements.last.name == name
        end

      end

    end

  end

end
