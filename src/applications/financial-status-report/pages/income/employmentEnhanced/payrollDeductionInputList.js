import PayrollDeductionInputList from '../../../components/PayrollDeductionInputList';

export const uiSchema = {
  currEmployment: {
    'ui:field': PayrollDeductionInputList,
  },
};

export const schema = {
  type: 'object',
  properties: {
    currEmployment: {
      type: 'array',
      items: {
        type: 'object',
        properties: {},
      },
    },
  },
};