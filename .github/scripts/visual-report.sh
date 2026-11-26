#!/usr/bin/env bash
set -euo pipefail

report="$1"
run_url="$2"

jq -r --arg run_url "$run_url" '
  [.testResults[].assertionResults[] | select(.status == "failed")] as $failed
  | if ($failed | length) == 0 then
      "No visual changes."
    else
      "**\($failed | length) stories changed visually.** Download the `visual-diff` artifact from the [workflow run](\($run_url)) to see the images.\n\n| Story | Changed pixels |\n| --- | --- |\n"
      + ($failed | map(
          (.failureMessages | join(" ") | capture("(?<px>[0-9]+) pixels \\(ratio (?<ratio>[0-9.]+)\\)")? // {px: "-", ratio: "-"}) as $diff
          | "| \(.title) | \($diff.px) |"
        ) | join("\n"))
    end
' "$report"
