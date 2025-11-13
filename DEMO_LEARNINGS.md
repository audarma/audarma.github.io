# Demo Learnings & Known Issues

## Bugs Found During Testing

### 1. Klingon Translation - JSON Object Returned as Text
**Issue**: Klingon translations are showing raw JSON objects instead of translated text.

**Example**:
```
{"text":"Audarma Demo"}
{"text":"maSung Qapla'pu' LLM Hegh jatlhISpu' Hacker News Hegh"}
```

**Root Cause**: Cerebras API sometimes returns structured objects like `{"text": "..."}` instead of plain strings for Klingon language. The current object-to-string conversion in `cerebras-provider.ts` doesn't handle this format.

**Current Code** (line 136-145):
```typescript
const translations = parsed.map((item: unknown) => {
  if (typeof item === 'string') {
    return item;
  }
  if (typeof item === 'object' && item !== null && 'translated' in item) {
    return String((item as { translated: unknown }).translated);
  }
  // Fallback: stringify the object
  return JSON.stringify(item);
});
```

**Issue**: The fallback `JSON.stringify(item)` is being triggered, which creates the visible JSON text.

**Fix Needed**:
- Check for `text` field in addition to `translated` field
- Better handling of nested object structures
- Consider logging when fallback is triggered for debugging

---

### 2. German Shows Kazakh Text - Cache Key Collision
**Issue**: When switching to German (de), the UI displays Kazakh (kk) translations instead of translating to German.

**Root Cause**: Likely a cache key collision or improper locale identification in Audarma's caching mechanism. The system is retrieving the wrong cached translations based on incorrect locale matching.

**Observed Behavior**:
1. User translates to Kazakh (kk)
2. User switches to German (de)
3. German shows Kazakh translations from cache

**Possible Causes**:
- Cache key doesn't include full locale identifier
- Locale normalization issue (de vs de-DE, kk vs kk-KZ)
- Race condition in cache lookup
- Browser localStorage key collision

**Investigation Needed**:
- ✅ Checked: `@/lib/localstorage-adapter.ts` correctly filters by `t.locale === targetLocale` (line 34)
- ✅ Checked: `@/lib/audarma-config.ts` correctly returns current locale from `useLocale()`
- ❌ Issue likely in Audarma library itself - the demo code is correct
- Possible Audarma bug: `getCurrentLocale()` might be called at component mount and cached, not re-evaluated on locale change
- **Workaround**: Users can clear cache and reload when switching languages
- **Fix Needed**: Report to Audarma library - `getCurrentLocale` should be re-evaluated per request, not cached

---

### 3. Cache Button Translation Collision in Elvish
**Issue**: In Elvish (Quenya), the "Cache" button text was replaced with a story title translation: "Nano Banana ná tincundë sáva AI tulkuntúra-nu"

**Root Cause**: Short UI text like "Cache" can collide with story titles that contain the same word. Even though cache keys include both `contentType` and `contentId`, having very short or common words increases the chance of translation mix-ups.

**Fix Applied**:
- Changed `contentId` from `"clear_cache"` to `"button_clear_cache"` for better uniqueness
- Prefix helps distinguish UI buttons from other content types
- More descriptive IDs reduce collision probability

**Prevention**:
- Use descriptive, prefixed IDs for UI elements (e.g., `button_*`, `label_*`, `heading_*`)
- Avoid single-word IDs for common words
- Consider namespace patterns: `{component}_{element}_{description}`

---

## Translation Quality Issues

### Fantasy Languages (Klingon, Quenya, Dothraki)
- More prone to returning structured objects instead of plain strings
- May require additional prompt engineering or post-processing
- Consider adding language-specific handlers for known problematic locales

---

## Recommendations

1. **Improve Object Parsing**: Add more robust object-to-string conversion with multiple fallback strategies
2. **Cache Debugging**: Add console logging for cache keys to identify collision issues
3. **Locale Validation**: Ensure locale codes are consistent throughout the translation pipeline
4. **Error Boundaries**: Add visual indicators when translations fail instead of showing raw JSON
5. **Testing**: Create automated tests for all supported languages, especially fantasy languages
