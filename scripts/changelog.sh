#!/bin/bash

# This script generates a draft for the entries to be added to `CHANGELOG.md`
# on every app release.
# It requires the Github CLI to be installed on your machine.

if ! which gh >/dev/null; then
  echo "The Github CLI is required for this script. Installation instructions: https://github.com/cli/cli#installation"
  exit 1
fi

# Reset local tags to match origin
git tag -d $(git tag -l) &> /dev/null
git fetch &> /dev/null

previous_version=$(git describe --abbrev=0)
merged_commits=$(
  git log \
    --first-parent master "$previous_version..HEAD" \
    --oneline \
    --pretty=format:"%h"
)

pr_url_list=()

for merge_commit in $merged_commits; do
  pr_json=$(gh pr list \
    --search $merge_commit \
    --state merged \
    --json number,title,url \
    --limit 1 | jq '.'
  )

  if [ $(echo $pr_json | jq length) -eq 0 ]; then
    # No PR found for commit
    continue
  fi

  url=$(echo $pr_json     | jq -r '.[0].url')
  number=$(echo $pr_json  | jq -r '.[0].number')
  title=$(echo $pr_json   | jq -r '.[0].title')

  pr_url_list+=("[#$number]: $url")

  pr_title=$(echo $title | sed -E "s/^(\[?ARTOO[-_ ]?[0-9]*\]?) ?(.*)/\2/g")
  pr_title_capitalized=$(tr '[:lower:]' '[:upper:]' <<<"${pr_title:0:1}")${pr_title:1}
  echo "- ${pr_title_capitalized} [#$number]"
done

echo ""
for url in "${pr_url_list[@]}"
do
  echo $url
done
