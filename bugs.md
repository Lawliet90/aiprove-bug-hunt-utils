# Bug reports — AIProve `bug-hunt-utils`

Source: https://github.com/AIProveRH/aiprove/tree/main/challenges/bug-hunt-utils
(`utils.js` copied here as `utils-under-test.js` for local verification.)
Machine-readable entry: `bugs.json` — a JSON list `[{fn, input, expected}]`, where `input` is the argument list (array) for the function, exactly as submitted to the API.
Re-run all reports with `node verify.js`.

## Bug 1 — `factorial` drops the final factor

- **Function:** `factorial(n)`
- **Failing input:** `5`
- **Actual (wrong) output:** `24`
- **Correct output:** `120`
- **Root cause:** the loop is `for (let i = 2; i < n; i++)` — `i < n` stops before
  multiplying by `n` itself, so it computes `(n-1)!` instead of `n!`.
  `factorial(5)` = 2·3·4 = 24; `factorial(2)` = 1. Fix: `i <= n`.
- **Verified:** `node verify.js` — `factorial(5) => got 24, expected 120`.

## Bug 2 — `countVowels` misses uppercase vowels

- **Function:** `countVowels(s)`
- **Failing input:** `"AEIOU"`
- **Actual (wrong) output:** `0`
- **Correct output:** `5`
- **Root cause:** the regex is `/[aeiou]/g` — lowercase only, so every uppercase
  vowel is skipped. Lowercase input works (`countVowels("aeiou")` = 5,
  `countVowels("Hello")` = 2), which is why this slips past a quick test.
  Fix: `/[aeiou]/gi`.
- **Verified:** `node verify.js` — `countVowels("AEIOU") => got 0, expected 5`.

## Bug 3 — `reverse` corrupts astral-plane characters (emoji)

- **Function:** `reverse(s)`
- **Failing input:** `"😀a"`
- **Actual (wrong) output:** `"a\uDE00\uD83D"` (the string `"a"` followed by two
  lone surrogates — malformed Unicode, not a valid string)
- **Correct output:** `"a😀"`
- **Root cause:** `s.split("")` splits UTF-16 code units, tearing surrogate pairs
  apart; reversing the units then rejoins them in the wrong order, producing lone
  surrogates. ASCII/BMP input reverses fine (`reverse("abc")` = `"cba"`), so this
  only shows on astral-plane input. Fix: `[...s].reverse().join("")`.
- **Verified:** `node verify.js` — `reverse("😀a") => got "a\ude00\ud83d", expected "a😀"`.
- **Honesty note:** whether this counts depends on the grader's reference
  implementation handling astral characters. The output is objectively malformed
  (lone surrogates are not valid Unicode scalar values), so it is reported as a
  genuine bug, not a style preference.

## Candidates checked and NOT reported (fresh-verifier disproof)

- `titleCase("don't")` → `"Don'T"`: dropped. Capitalising after an apostrophe is
  what several legitimate implementations do (e.g. Python's `str.title()`), so the
  "correct" behaviour is genuinely disputed — not a clear-cut bug.
- `isPalindrome("😀")` → `false`: dropped. Its own logic (`s === reverse(s)`) is
  correct; the wrong result comes entirely from Bug 3's `reverse`. Reporting it
  would double-count one defect.
- `sum`, `max`, `clamp`, `unique`, `average`, `isPalindrome` (BMP input),
  `reverse` (BMP input), `countVowels` (lowercase input): all verified correct
  on sanity inputs (`node -e` checks run during analysis; see BUILD_LOG.md).
- `max([])` / `average([])`: edge cases where the reference presumably behaves
  identically — not reported.
