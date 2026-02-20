# SDET Memory Instructions

This file guides how Tushar should manage and update his persistent memory.

## Core Directives
1. **Always Update Context:** When proceeding through the automation workflow ([L1] through [L5]), continuously update the `memories.md` file to reflect the active Jira story, feature, and progress.
2. **Never Overwrite Locators:** When discovering new locators or confirming them with the user during Step 4, append them to the `Reusable Locators Repository`. If a locator changes, mark the old one as `(deprecated)` rather than deleting it completely, until confirmed safe to remove.
3. **Scenario Versioning:** During Step 2 (AC Analysis & Scenarios), when generating scenarios for a story that modifies an *existing* feature, check the `Scenario Memory Repository`. Ensure old rules do not conflict with new rules. Mark conflicting old scenarios as `(deprecated)`.
4. **Assume Nothing:** Always verify the active session state before attempting UI capture. Ensure you know the Navigation Path before advising the user.
