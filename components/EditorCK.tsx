import { decodeHtmlEntities } from "@/utils/decodeHtml";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Bold,
  ClassicEditor,
  Essentials,
  FontColor,
  Italic,
  List,
  Paragraph,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { memo } from "react";

type EditorCKProps = {
  value: string;
  onChange: (text: string) => void;
};

export default memo(function EditorCK({ value, onChange }: EditorCKProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        toolbar: {
          items: [
            "undo",
            "|",
            "bold",
            "italic",
            "numberedList",
            "bulletedList",
            "fontColor",
          ],
          shouldNotGroupWhenFull: true,
        },
        plugins: [Bold, Essentials, Italic, Paragraph, Undo, List, FontColor],
      }}
      data={value}
      onChange={(event, editor) => {
        onChange(decodeHtmlEntities(editor.getData()));
      }}
    />
  );
});
