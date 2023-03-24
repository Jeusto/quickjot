import { gzip, ungzip } from "pako";
import { fromUint8Array, toUint8Array } from "js-base64";

export const zipurl = (data: string) => fromUint8Array(gzip(data), true);

export const unzipurl = (data: string) =>
  ungzip(toUint8Array(data), { to: "string" });

export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};
