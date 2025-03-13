# Type safe mixpanel

A set of utilities for safely defining mixpanel events

### Example

```ts
import { defineMpEvents, createTrackEvent } from "@yet3/type-safe-mixpanel";

export const MP = defineMpEvents({
  APP_MOUNT: mpinf("App has mounted"),

  BTN: {
    CLICKED: mpinf<{ btnId: string }>("User clicked button"),
  },

  INPUT_ERR: mperr<{ value: string }>("Generic error"),
});

const trackEvent = createTrackEvent();
const trackUserEvent = createTrackEvent({
  baseProps: () => ({
    USER_ID: "a3sd89z1kk4d1kl8",
  }),
});

trackEvent(MP.APP_MOUNT);
trackUserEvent(MP.BTN.CLICKED, { btnId: "v8u7" });
try {
  // ...
} catch (e) {
  trackEvent(MP.INPUT_ERR, { value: "", nativeError: e });
}
```
