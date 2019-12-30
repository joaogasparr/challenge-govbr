import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useField } from '@rocketseat/unform';
import AsyncSelect from 'react-select/async';

import { Container } from './styles';

export default function SelectAsync({
  name,
  label,
  options,
  multiple,
  onChange,
  ...rest
}) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [value, setValue] = useState(defaultValue);

  function parseSelectValue(selectRef) {
    const selectValue = selectRef.props.value;

    if (!multiple) {
      return selectValue ? selectValue.id : '';
    }

    return selectValue ? selectValue.map(option => option.id) : [];
  }

  useEffect(() => {
    if (defaultValue) {
      if (!multiple && defaultValue.includes) {
        setValue(options.filter(option => defaultValue.includes(option.id)));
      }

      setValue(options.find(option => option.id === defaultValue));
    }
  }, [defaultValue, multiple, options]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value',
      parseValue: parseSelectValue,
      clearValue: selectRef => {
        selectRef.select.clearValue();
      },
    });
  }, [ref.current, fieldName]);

  return (
    <Container>
      {label && <label htmlFor={fieldName}>{label}</label>}
      <AsyncSelect
        name={fieldName}
        aria-label={fieldName}
        isMulti={multiple}
        defaultOptions={options}
        defaultValue={value}
        value={value}
        onChange={value => {
          setValue(value);
          {
            onChange && onChange(value);
          }
        }}
        ref={ref}
        loadingMessage={() => 'Carregando...'}
        getOptionValue={option => option.id}
        getOptionLabel={option => option.title}
        defaultOptions
        {...rest}
      />

      {error && <span>{error}</span>}
    </Container>
  );
}

SelectAsync.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array]).isRequired,
  onChange: PropTypes.func,
};

SelectAsync.defaultProps = {
  label: '',
  onChange: null,
};
