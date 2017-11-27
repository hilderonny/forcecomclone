# Creating unit tests

The goal of writing tests is that all code paths in the application are tested at least once, meaning that we have a 100% code coverage.

But not every thinkable use case must be tested for every API. For example: For APIs using the default behaviour no further tests need to be done, because this default behaviour is tested in the core tests in detail and would only be repeated without meaningful differences.

APIs which extend the default beahaviour must test only the extended behaviour, but this with every possible use case.

Sometimes code paths are technically fully tested but not every logical use case is checked. In this case additional tests are needed for the logical use cases. This can mean, that some code paths are covered multiple times, but that's okay.

## Writing tests

For each module you have in `/src/server/modules` you should have a test file in `/src/test/server/modules` with the same file name. In this test file all of the APIs and additional classes of the module must be tested. The focus should here be on handling errornous input correctly, so write down tests which try to 'hack' the APIs and make sure that the APIs behave stable.

As testing framework [Mocha](https://mochajs.org/) is used and the test file should be clustered into the following structure:

* Module
    * API
        * HTTP Method
            * Use case
            * Use case
    * Another API
    * Helper class
        * Function
            * Use case

So a typical test file could have the following structure:

```typescript
describe('Module MyModule', () => {
    
    beforeEach(async () => {
        // Initialize the tests ad data structure, see next chapter
    })

    describe('API MyApi', () => {
        
        it('Handles unexpected input correctly', async() => {
            // ...
        })
        
        it('Does something amazing', async() => {
            // ...
        })

    })

})
```

## Test initialization

All tests should be done with an emtpy data store and a completely new application instance wo that the tests do not influence themselves. For this you prepare the application and the module(s) to test in the `beforeEach` hook of the test file.

```typescript
import { default as MyModule } from "../../../server/modules/mymodule"

describe('Module MyModule', () => {
    
    beforeEach(async () => {
        await TestHelper.init()
        MyModule(TestHelper.app)
    })

    // ... 

})
```

First you need to import the module(s) required for the tests. Then call `TestHelper.init()` before each test. This creates a clean application instance and assigns a fake empty database so that you can test reading from and writing into the database within your tests.

Finally initialize all modules by giving them the application instance from the testhelper. This makes sure that the APIs of the modules are reachable by the unit tests via HTTP calls.

Make sure to initialize only those modules you really need within your tests. This minimizes the adaption effort of the tests when the functionality of the modules change.