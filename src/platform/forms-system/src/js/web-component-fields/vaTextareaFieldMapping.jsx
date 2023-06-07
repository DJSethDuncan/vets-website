import React from 'react';
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function vaTextareaFieldMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
    childrenProps,
  } = props;

  return {
    ...commonFieldMapping(props),
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    onInput: (event, value) => {
      const newVal = value ?? event.target.value ?? undefined;
      childrenProps.onChange(newVal);
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    children: (
      <>
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </>
    ),
  };
}