import { MixedTestClass } from '../classes/mixed-test-class';

export class MixedTestClassConsumer {
  private testClass: MixedTestClass;
  constructor() {
    this.testClass = new MixedTestClass();
  }
  public foo() {
    return MixedTestClass.foo();
  }

  public getCount() {
    return this.testClass.count;
  }
}
