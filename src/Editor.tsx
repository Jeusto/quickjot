import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { zipurl, unzipurl, formatTimestamp } from "./utils";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Text,
  useMantineColorScheme,
} from "@mantine/core";

export const initialContent = `
<h2>Welcome to QuickJot</h2>
<p>This is a proof of concept for an entirely client-side web app that uses the URL to store the state. This example is a simple text editor for note taking purposes. Start editing and press Ctrl+S or click the "Save to URL" button to save your note.
The state of the editor is compressed and encoded into the URL. You can now share the URL with others or bookmark it for later.
The editor uses <a href="https://mantine.dev/">Mantine.dev</a> and is based on <a href="https://tiptap.dev/">Tiptap.dev</a>. It supports Markdown in addition to the rich text editor.
`;
export function Editor() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const clipboard = useClipboard({ timeout: 500 });

  const [lastSavedTime, setLastSavedTime] = useState<number | null>(null);
  let keydownFlag = useRef(false);

  // Save editor content to URL
  function saveEditorToURL(editor: any, keydownFlag: boolean) {
    if (!keydownFlag) keydownFlag = true;
    let state = zipurl(editor?.getHTML() || "");

    window.location.hash = state;
    setLastSavedTime(Date.now());
  }

  // Configure editor
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: initialContent,
  });

  // Retreve editor content from URL
  useEffect(() => {
    if (window.location.hash) {
      editor?.commands.setContent(unzipurl(window.location.hash.substring(1)));
    }
  }, [editor]);

  // Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveEditorToURL(editor, keydownFlag.current);
      } else {
        keydownFlag.current = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <RichTextEditor editor={editor}>
        <Flex justify="space-between" p="md">
          <Group>
            <Button
              onClick={() => {
                saveEditorToURL(editor, keydownFlag.current);
                notifications.show({
                  title: "Saved",
                  message:
                    "Your document has been saved to the URL. You can now share it with others.",
                });
              }}
            >
              Save to URL
            </Button>
            <Button
              variant="light"
              onClick={() => {
                saveEditorToURL(editor, keydownFlag.current);
                clipboard.copy(window.location);
                notifications.show({
                  title: "Copied",
                  message:
                    "Your document URL has been copied to your clipboard. You can now share it with others.",
                });
              }}
            >
              Share note
            </Button>
            <Text>
              {lastSavedTime
                ? `Last saved: ${formatTimestamp(lastSavedTime)}`
                : "Not saved yet"}
            </Text>
          </Group>
          <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
          </ActionIcon>
        </Flex>

        <RichTextEditor.Toolbar sticky>
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

        <RichTextEditor.Content style={{ minHeight: "80vh" }} />
      </RichTextEditor>
    </div>
  );
}
