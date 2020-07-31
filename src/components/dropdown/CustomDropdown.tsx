import React, { useCallback } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownSelectedItem,
} from '@fluentui/react-northstar';

interface CustomDropdownProps {
  inputItems: any;
  placeholder: string;
  checkable?: boolean;
  uniqueKey?: string;
  clearable?: boolean;
  onChange?: (data: any) => void;
  value?: any;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  inputItems,
  placeholder,
  uniqueKey,
  checkable = false,
  clearable = false,
  value,
  onChange,
}) => {
  const onChangeSelect = useCallback(
    (_event, data) => {
      onChange?.(data);
    },
    [onChange]
  );

  const renderItem = useCallback(
    (_component, data) => {
      return (
        <DropdownItem content={uniqueKey ? data[uniqueKey] : data} {...data} />
      );
    },
    [uniqueKey, onChangeSelect]
  );

  const itemToString = useCallback((item) => {
    return uniqueKey && item ? item[uniqueKey] : item ? item : '';
  }, []);

  return (
    <Dropdown
      items={inputItems}
      placeholder={placeholder}
      checkable={checkable}
      getA11ySelectionMessage={{
        onAdd: (item) => `${item} has been selected.`,
      }}
      itemToString={itemToString}
      renderItem={renderItem}
      value={value ?? undefined}
      onChange={onChangeSelect}
      clearable={clearable}
    />
  );
};
