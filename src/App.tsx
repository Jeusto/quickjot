import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { gzip, ungzip } from "pako";
import { fromUint8Array, toUint8Array } from "js-base64";
import { useEffect } from "react";

export const zipurl = (data: string) => {
  return fromUint8Array(gzip(data), true);
};

export const unzipurl = (data: string) => {
  return ungzip(toUint8Array(data), { to: "string" });
};

// const content =
//   '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';
const content = "<p>par defaut</>";

function App() {
  let keydownFlag = false;

  // console.log(unzipurl("H4sIAAAAAAAAA7MpsCtJLS6x0S-wAwA-EY9OCwAAAA"));

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
  });

  editor?.on("update", () => {
    console.log(editor.getHTML());
    window.location.hash = zipurl(editor.getHTML());
    // window.history.pushState({}, "", `?content=${zipurl(editor.getHTML())}`);
  });

  useEffect(() => {
    editor?.commands.setContent("<>test</>");
    console.log("useEffect");
    console.log(window.location.hash.substring(1));
    console.log(unzipurl(window.location.hash.substring(1)));
    // if (window.location.hash) {
    editor?.commands.setContent(unzipurl(window.location.hash.substring(1)));
    // }
  }, []);

  // intercept Ctrl+save
  // document.addEventListener("keydown", (e) => {
  //   if (e.ctrlKey && e.key === "s") {
  //     e.preventDefault();
  //     let state = fromUint8Array(gzip(content), true);
  //     if (!keydownFlag) {
  //       console.log(editor?.getHTML().substring(0, 5));
  //       keydownFlag = true;
  //     }
  //     // console.log(ungzip(toUint8Array(state), true));
  //     // window.history.pushState({}, "", ?content=${zipurl(content)});
  //   } else {
  //     keydownFlag = false;
  //   }
  // });

  return (
    <>
      <button
        onClick={() => {
          console.log("button click");
          editor?.commands.setContent(
            unzipurl(window.location.hash.substring(1))
          );
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        Test
      </button>
      <RichTextEditor
        editor={editor}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
          minWidth: "100vw",
          maxWidth: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content
          style={{
            marginTop: "3rem",
            overflow: "scroll",
          }}
        />
      </RichTextEditor>
    </>
  );
}

export default App;
