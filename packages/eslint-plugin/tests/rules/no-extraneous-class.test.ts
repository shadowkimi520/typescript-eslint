/**
 * @fileoverview Forbids the use of classes as namespaces
 * Some tests adapted from  https://github.com/palantir/tslint/tree/c7fc99b5/test/rules/no-unnecessary-class
 * @author Jed Fox
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../src/rules/no-extraneous-class';
import RuleTester from '../RuleTester';

const empty = {
  messageId: 'empty' as 'empty'
};
const onlyStatic = {
  messageId: 'onlyStatic' as 'onlyStatic'
};
const onlyConstructor = {
  messageId: 'onlyConstructor' as 'onlyConstructor'
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser'
});

ruleTester.run('no-extraneous-class', rule, {
  valid: [
    `
class Foo {
    public prop = 1;
    constructor() {}
}
`,
    `
export class CClass extends BaseClass {
    public static helper(): void {}
    private static privateHelper(): boolean {
        return true;
    }
    constructor() {}
}
`,
    `
class Foo {
   constructor(
     public bar: string
   ) {}
}
`,
    {
      code: 'class Foo {}',
      options: [{ allowEmpty: true }]
    },
    {
      code: `
class Foo {
    constructor() {}
}
`,
      options: [{ allowConstructorOnly: true }]
    },
    {
      code: `
export class Bar {
    public static helper(): void {}
    private static privateHelper(): boolean {
        return true;
    }
}
`,
      options: [{ allowStaticOnly: true }]
    }
  ],

  invalid: [
    {
      code: 'class Foo {}',
      errors: [empty]
    },
    {
      code: `
class Foo {
    public prop = 1;
    constructor() {
        class Bar {
            static PROP = 2;
        }
    }
}
export class Bar {
    public static helper(): void {}
    private static privateHelper(): boolean {
        return true;
    }
}
`,
      errors: [onlyStatic, onlyStatic]
    },
    {
      code: `
class Foo {
    constructor() {}
}
`,
      errors: [onlyConstructor]
    },
    {
      code: `
export class AClass {
    public static helper(): void {}
    private static privateHelper(): boolean {
        return true;
    }
    constructor() {
        class nestedClass {
        }
    }
}

`,
      errors: [onlyStatic, empty]
    }
  ]
});
