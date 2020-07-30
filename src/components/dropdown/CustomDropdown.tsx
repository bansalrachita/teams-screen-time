import React from 'react';
import { Dropdown } from '@fluentui/react-northstar';

interface CustomDropdownProps {
  inputItems: any;
  placeholder: string;
  checkable?: boolean;
  uniqueKey?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  inputItems,
  placeholder,
  uniqueKey,
  checkable = true,
}) => {
  const items =
    uniqueKey && inputItems
      ? inputItems.map((item: { [x: string]: any }) => {
          return item[uniqueKey!];
        })
      : inputItems;

  return (
    <Dropdown
      items={items}
      placeholder={placeholder}
      checkable={checkable}
      getA11ySelectionMessage={{
        onAdd: (item) => `${item} has been selected.`,
      }}
    />
  );
};
