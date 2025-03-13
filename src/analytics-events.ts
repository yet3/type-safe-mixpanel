import mixpanel from "mixpanel-browser";
import {
  MpEventType,
  type IMpEvents,
  type IAnaltyicTrackFn,
  type ICreateTrackEvent,
  type IMpEvent,
  type IMpEventOpts,
} from "./analytics-types";

// define mixpanel events
export const defineMpEvents = <TEvents extends IMpEvents>(events: TEvents) => {
  return events;
};

// define mixpanel event
const defineEvent = <TDetails>(
  type: MpEventType,
  name: string,
  opts?: Partial<IMpEventOpts>,
): IMpEvent<TDetails> => ({
  eventType: type,
  eventName: name,
  opts: {
    isEnabled: true,
    isDebug: false,
    ...opts,
  },
  detailsType: null as TDetails,
});

// mixpanel info event
export const mpinf = <TDetails extends Record<string, unknown> | never = never>(
  name: string,
  opts?: Partial<IMpEventOpts>,
): IMpEvent<TDetails> => {
  return defineEvent<TDetails>(MpEventType.Info, name, opts);
};

// mixpanel error event
export const mperr = <
  TDetails extends Record<string, unknown>,
  TDetailsFinal = TDetails & { nativeError: unknown },
>(
  name: string,
  opts?: Partial<IMpEventOpts>,
) => {
  return defineEvent<TDetailsFinal>(MpEventType.Error, name, opts);
};

// mixpanel error event
export const mpwarn = <
  TDetails extends Record<string, unknown>,
  TDetailsFinal = TDetails,
>(
  name: string,
  opts?: Partial<IMpEventOpts>,
) => {
  return defineEvent<TDetailsFinal>(MpEventType.Warning, name, opts);
};

export const ANALYTIC_MSG_TYPE = "mixpanel-track-event";

export enum MixpanelEventType {
  info = "info",
  error = "error",
}

export const createTrackEvent = ({ baseProps }: ICreateTrackEvent = {}) => {
  const trackEvent: IAnaltyicTrackFn = (event, ...details) => {
    const { eventName, eventType, opts } = event;

    const eventDetails: Record<string, unknown> = {
      ...(details[0] ?? {}),
    };

    if (eventType === MpEventType.Error) {
      if (eventDetails.nativeError) {
        if (typeof eventDetails.nativeError !== "string") {
          eventDetails.nativeError = String(eventDetails.nativeError);
        }
      }
    }

    let props = {};
    if (typeof baseProps === "function") {
      props = baseProps({ event });
    }

    props = {
      ...props,
      EVENT_TYPE: eventType,
      EVENT_DETAILS: {
        ...eventDetails,
      },
    };

    if (opts.isEnabled) {
      try {
        mixpanel.track(eventName, props);
      } catch (e) {
        console.error("Error executing mixpanel.track", e);
      }
    }

    if (opts.isDebug) {
      console.log("Tracking:\n---------\n", eventName, "\n---------", props);
    }
  };

  return trackEvent;
};
