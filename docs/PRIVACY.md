# Privacy

Dev Toolkit does not collect, transmit or sell any data.

<br/>

## What is stored

- the last five inputs you ran in each tool, so the latest one is back when you return to that tool
- your theme, light or dark

Outputs, and inputs you never run, are not stored. When you sign a JWT, the secret on the input's second line is stored with that input like the rest of it, so prefer a throwaway secret for shared machines.

<br/>

## Where it is stored

In the popup's `localStorage`, in your Chrome profile on that one browser. It is not synced, and Dev Toolkit has no server and makes no network requests: every conversion, hash and signature is computed in the popup.

<br/>

## Permissions

None. Dev Toolkit cannot read your tabs, pages, cookies or browsing history.

<br/>

## Removing your data

**Clear** empties the fields but keeps the history. To remove the history and the theme, remove the extension, or open the popup's DevTools (right-click the popup, **Inspect**) and run `localStorage.clear()`.
