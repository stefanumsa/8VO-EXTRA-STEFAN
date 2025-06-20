import React from "react";
import Text from "../../../atoms/Text/Text";
import Icon from "../../../atoms/Icono/Icon";
import Button from "../../../atoms/Button/Button";
import { ButtonWithIconAndTextProps } from "../types/ButtonTextIcon";

export default function ButtonWithIconAndText({ iconName, text,onClick, buttonStyle,iconStyle,textStyle,iconSize = 24,iconColor = "black",}: ButtonWithIconAndTextProps) {
  return (
    <Button onClick={onClick} style={buttonStyle}>
      <Icon name={iconName} size={iconSize} color={iconColor} style={iconStyle} />
      <Text style={textStyle}>{text}</Text>
    </Button>
  );
}