---
title: "URL Encoder / Decoder: Encode and Decode URLs and Query Strings Online"
date: "2026-10-10"
description: "Encode and decode URLs, query strings, and URI components with parameter breakdown, instantly in your browser. No API calls, no logging."
---

A query string shows up in a bug report full of `%20` and `%3D` characters and someone needs to actually read what it says. Or a developer needs to build a URL with a parameter that contains spaces, ampersands, or special characters, and needs to percent-encode it correctly before it breaks the request. Either direction of this problem is common enough that most developers have bookmarked some random "URL encode" website at some point, usually without thinking twice about what that site does with the URL you just pasted in, which might contain session tokens, internal API paths, or other details you'd rather not hand to a third party.

## Why URL encoding doesn't need to leave your browser

Percent-encoding is a well-defined, deterministic transformation built directly into JavaScript (`encodeURIComponent`, `decodeURIComponent`, and friends), so there's no computational reason this needs a server at all. The more interesting reason to keep it local is what URLs often contain: query parameters frequently carry auth tokens, internal identifiers, or search terms tied to a specific user or system. Pasting a URL with an embedded token into a random online tool means that token is now sitting in that tool's server logs, even if you only needed to decode a single character.

## How to encode or decode a URL with ihatetools

1. Open the [URL Encoder / Decoder](/tools/url-encoder-decoder) tool.
2. Paste in a full URL, a query string, or a single value you want to encode or decode.
3. Switch between encode and decode mode depending on your direction.
4. Use the parameter breakdown view to see each query parameter split out individually, which is especially useful for long URLs with many parameters where you just need to check or edit one value.
5. Copy the result back into your code, API request, or browser address bar.

Because this runs instantly in the browser, it's genuinely faster to paste a URL here than to open a terminal and run `node -e "console.log(decodeURIComponent(...))"`, especially for anyone who isn't comfortable in a terminal in the first place.

## Encoding concepts worth actually understanding

- **`encodeURIComponent` vs `encodeURI`**: `encodeURIComponent` escapes a much wider set of characters and is the right choice for encoding an individual query parameter value. `encodeURI` is meant for encoding a whole URL that already has its structural characters (`/`, `?`, `&`, `:`) intact, and will leave those untouched. Using the wrong one is a common source of bugs, like a `&` inside a parameter value accidentally being read as a new parameter separator.
- **Reserved characters matter**: Characters like `&`, `=`, `?`, and `#` have structural meaning in a URL. If a value you're inserting into a query string contains any of them, they must be percent-encoded or the URL will parse incorrectly.
- **Double-encoding is a real bug**: If a value is encoded twice (turning `%20` into `%2520`), it will decode incorrectly on the receiving end. Always check whether a value is already encoded before encoding it again, this is a frequent cause of "the link doesn't work" bugs in production.
- **Spaces**: `encodeURIComponent` turns a space into `%20`, while the older `application/x-www-form-urlencoded` convention (used in form submissions) uses `+` instead. Know which context you're working in, mixing the two conventions causes subtle bugs.

## Practical tips

- When debugging a broken link from a bug report, decode the full URL first to read it in plain text before trying to isolate which parameter is causing the problem.
- If you're building a URL programmatically with multiple parameters, encode each value individually with `encodeURIComponent` before assembling the full query string, rather than encoding the whole thing at once.
- For URLs containing Base64-encoded data in a parameter, you may need both URL-decoding and Base64-decoding in sequence; see [Base64 to Image](/tools/base64-to-image) if that data turns out to be an embedded image.
- If you're debugging API payloads more broadly, pair this with the [JSON Formatter](/tools/json-formatter) for request bodies alongside the [Hash Generator](/tools/hash-generator) for any checksum or signature parameters.

## FAQ

### What's the difference between encoding a URL and encoding a URL component?
Encoding a full URL preserves its structural characters (like `/` and `?`) while escaping everything else. Encoding a single component (like a query parameter value) escapes a much broader set of characters, including ones that would otherwise be interpreted as part of the URL's structure.

### Why does my decoded URL still have `%20` or other codes in it?
If a value was encoded more than once, decoding it a single time only removes one layer. Try decoding the result again, or check whether the original encoding process accidentally ran twice.

### Is it safe to paste a URL containing an auth token into an online tool?
Only if the tool processes it entirely client-side, meaning the URL never gets transmitted to a server. This tool works that way: encoding and decoding both happen locally in your browser.

### Why do some URLs use `+` instead of `%20` for spaces?
That convention comes from the `application/x-www-form-urlencoded` format used in traditional HTML form submissions, which predates and differs slightly from standard URI component encoding. Both represent a space, but in different encoding contexts.

## Decode or build your URL now

Stop pasting URLs with embedded tokens into tools that might be logging them. Open the [URL Encoder / Decoder](/tools/url-encoder-decoder) on [ihatetools](/home) and handle encoding, decoding, and parameter breakdowns entirely in your own browser.
