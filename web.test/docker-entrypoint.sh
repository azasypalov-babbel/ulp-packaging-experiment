#!/bin/bash
set -e

WEBDRIVER_URL="${WEBDRIVER_URL:-"http://localhost:4444/wd/hub"}"
TEST_ENV="${TEST_ENV:-"http://localhost:3000"}"

# delay before next check (in seconds)
CHECK_DELAY=${CHECK_DELAY:-3}
CHECK_TIMEOUT=${CHECK_TIMEOUT:-5}

CUCUMBER_ARGUMENTS=(${CUCUMBER_ARGUMENTS:-${@}})

selenium_hub_ready () {
  curl -sSL --insecure --max-time $CHECK_TIMEOUT "${WEBDRIVER_URL}/status" 2>/dev/null | jq -r '.value.ready' | grep 'true'
}

application_ready () {
  curl -sSL --insecure --max-time $CHECK_TIMEOUT "${TEST_ENV}" &>/dev/null
}

while ! selenium_hub_ready; do
  echo "Wait for selenium hub..."
  sleep 1
done


while ! application_ready; do
  echo "Wait for lesson-player hub..."
  sleep 1
done


echo bundle exec cucumber "${CUCUMBER_ARGUMENTS[@]}"
bundle exec cucumber "${CUCUMBER_ARGUMENTS[@]}"