class Boolean

  attr_reader :value

  def initialize(value)
    @value = value
  end

end

ParameterType(
  name: 'should_or_not',
  regexp: /should|should not/,
  type: Boolean,
  transformer: ->(s) { Boolean.new(s == 'should') }
)
