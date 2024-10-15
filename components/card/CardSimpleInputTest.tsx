import { memo } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnNumberedList,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

export default memo(function CardSimpleInputTest({
  value,
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}) {
  return (
    <EditorProvider>
      <Editor value={value} onChange={(e) => onChange(e.target.value)}>
        <Toolbar>
          <BtnUndo />
          <Separator />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <Separator />
        </Toolbar>
      </Editor>
    </EditorProvider>
  );
});
