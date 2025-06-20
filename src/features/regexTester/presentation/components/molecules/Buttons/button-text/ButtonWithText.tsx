import React from "react";
import Text from "../../../atoms/Text/Text";
import Button from "../../../atoms/Button/Button";
import { ButtonWithTextProps } from "../types/TextButton";

export default function ButtonWithText({onClick,buttonStyle,textStyle,text,}: ButtonWithTextProps) {
  return (
    <Button onClick={onClick} style={buttonStyle}>
      <Text style={textStyle}>{text}</Text>
    </Button>
  );
}