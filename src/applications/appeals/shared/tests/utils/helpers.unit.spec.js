import { expect } from 'chai';

import { isEmptyObject, getItemSchema } from '../../utils/helpers';

describe('isEmptyObject', () => {
  it('should return true for an empty object', () => {
    expect(isEmptyObject({})).to.be.true;
  });
  it('should return true for non objects or filled objects', () => {
    expect(isEmptyObject()).to.be.false;
    expect(isEmptyObject('')).to.be.false;
    expect(isEmptyObject([])).to.be.false;
    expect(isEmptyObject('test')).to.be.false;
    expect(isEmptyObject(null)).to.be.false;
    expect(isEmptyObject(true)).to.be.false;
    expect(isEmptyObject(() => {})).to.be.false;
    expect(isEmptyObject({ test: '' })).to.be.false;
  });
});

describe('getItemSchema', () => {
  const schema = {
    items: [{ a: 1 }, { a: 2 }, { a: 3 }],
    additionalItems: { b: 1 },
  };
  it('should return indexed iItems', () => {
    expect(getItemSchema(schema, 0)).to.deep.equal({ a: 1 });
    expect(getItemSchema(schema, 1)).to.deep.equal({ a: 2 });
    expect(getItemSchema(schema, 2)).to.deep.equal({ a: 3 });
  });
  it('should return additionalItems', () => {
    expect(getItemSchema(schema, 3)).to.deep.equal({ b: 1 });
  });
});