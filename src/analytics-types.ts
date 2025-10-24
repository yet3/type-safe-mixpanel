export enum MpEventType {
  Info = "info",
  Error = "error",
  Warning = "warning",
}

export interface IMpEventOpts {
  isEnabled: boolean;
  isDebug: boolean;
}

export interface IMpEvent<TDetails> {
  eventName: string;
  eventType: MpEventType;
  detailsType: TDetails;

  opts: IMpEventOpts;
}

export interface IMpEvents {
  // biome-ignore lint/suspicious/noExplicitAny:
  [event: string]: IMpEvent<any> | IMpEvents;
}

export interface ICreateTrackEvent {
  // biome-ignore lint/suspicious/noExplicitAny:
  baseProps?: (ctx: { event: IMpEvent<unknown>, details: Record<string, any> }) => Record<string, unknown>;
  postDetails?: (ctx: { event: IMpEvent<unknown>, details: Record<string, any> }) => Record<string, unknown>;
}

export type IAnaltyicTrackFn = <TEvent extends IMpEvent<unknown>>(
  event: TEvent,
  ...details: TEvent["detailsType"] extends never
    ? [undefined?]
    : [TEvent["detailsType"]]
) => void;
