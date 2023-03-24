import { gzip, ungzip } from "pako";
import { fromUint8Array, toUint8Array } from "js-base64";

export const zipurl = (data: string) => fromUint8Array(gzip(data), true);

export const unzipurl = (data: string) =>
  ungzip(toUint8Array(data), { to: "string" });

export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

export const initialContent = `
<h2>Welcome to QuickJot</h2>
<p>This is a proof of concept for an entirely client-side web app that uses the URL to store the state.
This example is a simple text editor for note taking purposes but it could be used for many other things.
Start editing and press Ctrl+S or click the "Save to URL" button to save your note.
The state of the editor is compressed and encoded into the URL.
You can now share the URL with others or bookmark it for later.
The editor uses <a href="https://mantine.dev/">Mantine.dev</a> and is based on <a href="https://tiptap.dev/">Tiptap.dev</a>.
It supports Markdown in addition to the rich text editor.</p>
`;
