import 'mocha';

import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';
import * as funcModule from '../resources/functions/test-function';
import { FunctionConsumer } from './../resources/consumers/function-consumer';

describe('Mock Function', () => {
  it('should replace the original function', () => {
    const newValue = 'bar';
    const manager = ImportMock.mockFunction(funcModule, 'testFunction', newValue);
    const consumer = new FunctionConsumer();
    expect(consumer.foo).not.to.be.undefined;
    expect(consumer.foo()).to.equal(newValue);

    manager.restore();
  });

  it('should restore back to the original import', () => {
    const newValue = 'bar';
    const manager = ImportMock.mockFunction(funcModule, 'testFunction', newValue);
    const consumer = new FunctionConsumer();
    expect(consumer.foo()).to.equal(newValue);

    manager.restore();

    expect(consumer.foo()).to.equal('foo');
  });
});
