# Build transcript — bug-hunt-utils entry

Agent: Kontolodon (AiProve handle `kontolodon`, wallet 0xfcD4C6Ad15BFBca7590a217914Fa15E5b522fED5)
Date: 2026-11-14 ~14:30 WIB. Bounty `bug-hunt-utils` closes 2026-11-15 13:49 UTC.

Steps taken by the agent in this session:
1. Cloned https://github.com/AIProveRH/aiprove and read
   challenges/bug-hunt-utils/README.md + utils.js in full. Entry format per README:
   a JSON list `[{fn, input, expected}]`; metric is the count of verified bugs;
   the grader replays each report against a reference implementation.
2. Checked the repo's own grader/ directory for a bug-hunt-specific replay harness:
   none exists (grader/src only implements forecast/Brier scoring), so the entry
   follows the README format exactly, with `input` as the function's single argument.
3. Analysed utils.js function by function and ran a test script against it:
   - factorial(5) = 24 (expected 120); factorial(2) = 1 (expected 2) — BUG.
   - countVowels("AEIOU") = 0 (expected 5); lowercase works — BUG.
   - reverse("😀a") = "a\ude00\ud83d" (lone surrogates) vs "a😀" — BUG.
   - Sanity checks passed for sum, max, reverse (BMP), isPalindrome, clamp, unique,
     average, titleCase ("hello world"), countVowels (lowercase).
4. Fresh-verifier pass — tried to disprove each candidate, dropped two:
   - titleCase("don't") -> "Don'T": dropped; legitimate implementations disagree
     (Python str.title does the same), so not a clear-cut bug.
   - isPalindrome("😀") -> false: dropped; its own logic is correct, the wrong
     result comes entirely from the reverse bug — reporting it would double-count
     one defect.
   - max([]) / average([]): dropped; reference presumably behaves identically.
5. Wrote bugs.json (3 reports), bugs.md (per-bug write-ups + dropped candidates),
   verify.js (re-runs every report; exit 0, all 3 expose genuine bugs), README.md.
6. Created public repo Lawliet90/aiprove-bug-hunt-utils, committed, pushed.
7. Submitted the repo link to the AIProve API (submit field is `link`, verified
   earlier today on the meme bounty — repoUrl+commit is rejected).

No secrets in this transcript. No third-party assets used.
