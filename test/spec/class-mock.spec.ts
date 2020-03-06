import 'mocha';

import { expect } from 'chai';
import { ImportMock, MockManager, StaticMockManager } from 'ts-mock-imports';
import * as staticTestClass from '../resources/classes/static-test-class';
import * as mixedTestClass from '../resources/classes/mixed-test-class';
import * as testClass from '../resources/classes/test-class';
import * as defaultClass from '../resources/classes/test-default-export';
import { DefaultClassConsumer, StaticTestClassConsumer, TestClassConsumer, MixedTestClassConsumer } from '../resources/consumers';

describe('Class Mock', () => {
  describe('Mock Class', () => {
    it('should replace the original export with mock class', () => {
      const manager = ImportMock.mockClass(testClass, 'TestClass');
      const consumer = new TestClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });

    it('should replace default export with mock class', () => {
      const manager = ImportMock.mockClass(defaultClass);
      const consumer = new DefaultClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });

    it('.mock should return given object', () => {
      const manager = ImportMock.mockClass(testClass, 'TestClass');
      manager.mock("foo", true)
      const consumer = new TestClassConsumer();
      expect(consumer.foo()).to.be.true;
      manager.restore();
    });

    it('.set should set given value', () => {
      const manager = ImportMock.mockClass(testClass, 'TestClass');
      manager.set("count", 5)
      const consumer = new TestClassConsumer();
      expect(consumer.getCount()).to.equal(5);
      manager.restore();
    });

    it('.mock should replace function', () => {
      const manager = ImportMock.mockClass(testClass, 'TestClass');
      let stub = manager.mock("foo")
      var count = 0;
      stub.callsFake(() => {
        count++;
      });
      const consumer = new TestClassConsumer();
      expect(consumer.foo()).to.be.undefined;
      expect(count).to.equal(1)
      manager.restore();
    });

  });

  describe('Mock Static Class', () => {
    it('should replicate all static functions', () => {
      const manager = ImportMock.mockStaticClass(staticTestClass, 'StaticTestClass');
      const consumer = new StaticTestClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });

    it('.mock should return given object', () => {
      const manager = ImportMock.mockStaticClass(staticTestClass, 'StaticTestClass');
      manager.mock("foo", true)
      const consumer = new StaticTestClassConsumer();
      expect(consumer.foo()).to.be.true;
      manager.restore();
    });
  });

  describe('Mock Mixed Class', () => {
    it('should replicate all static functions', () => {
      const manager = ImportMock.mockStaticClass(mixedTestClass, 'MixedTestClass');
      const consumer = new MixedTestClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });

    it('.mock should return given value', () => {
      let manager: StaticMockManager<mixedTestClass.MixedTestClass>
      manager = ImportMock.mockStaticClass(mixedTestClass, 'MixedTestClass');
      manager.mock("foo", true)
      const consumer = new MixedTestClassConsumer();
      expect(consumer.foo()).to.be.true;
      manager.restore();
    });
    it('should replicate all instance functions', () => {
      const manager = ImportMock.mockClass(mixedTestClass, 'MixedTestClass');
      const consumer = new MixedTestClassConsumer();
      expect(consumer.getCount).not.to.be.undefined;
      expect(consumer.getCount()).to.be.undefined;
      manager.restore();
    });
  });

  describe('Mock Manager', () => {
    let manager: MockManager<testClass.TestClass>;

    beforeEach(() => {
      manager = ImportMock.mockClass(testClass, 'TestClass');
    });

    afterEach(() => {
      manager.restore();
    });

    it('should return given value when mocking a function', () => {
      const consumer = new TestClassConsumer();
      const newReturnVal = 'baz';
      manager.mock('foo', newReturnVal);
      expect(consumer.foo()).to.equal(newReturnVal);
    });

    it('should contain given value when setting a variable', () => {
      const consumer = new TestClassConsumer();
      const newVal = 2;
      manager.set('count', newVal);
      expect(consumer.getCount()).to.equal(newVal);
    });

    it('should return a instance of the mocked class when asked', () => {
      const newReturnVal = 'baz';
      manager.mock('foo', newReturnVal);
      const instance = manager.getMockInstance();
      expect(instance.foo()).to.equal(newReturnVal);
    });

    it('should restore back to the original import', () => {
      manager.restore();
      const consumer = new TestClassConsumer();
      expect(consumer.foo()).to.equal('bar');
      expect(consumer.getCount()).to.equal(1);
    });
  });
});
