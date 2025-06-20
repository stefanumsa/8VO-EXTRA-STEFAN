import React from "react";
import Button from "../../../atoms/Button/Button";
import Icon from "../../../atoms/Icono/Icon";
import { IconButtonProps } from "../types/IconButton";

export default function IconButton({iconName,onClick,children,style,iconSize = 24,iconColor = 'black',}: IconButtonProps) {
  return (
    <Button onClick={onClick} style={style}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
      {children}
    </Button>
  );
}