# E2E
## Selecting Elements
> **Best Practice:** Use `data-*` attributes to provide context to your selectors and insulate them from CSS or JS changes.

Why?
* Your selectors break from development changes to CSS styles or JS behavior

*Example:*
```html
<button id="main" class="btn btn-large" data-cy="submit">Submit</button>
```
## Assigning Return Values
> **Anti-Pattern:** Trying to assign the return value of Commands with `const`, `let`, or `var`.
> **Best Practic:** Use `.then(...)`, `.as(...)` or `chain commands` to access what Cypress command yields

Why?
* Cypress is built using Promises that come from `Bluebird`
  * Bluebird: Third party promise library
* Cypress commands do not return these typical Promise instances. Instead it returns `Chainer` that acts like a layer sitting on top of the internal Promise instances

For this reason:
* You cannot ever return or assign anything useful from Cypress commands

> **Avoid:** Use of Promises directly (eg: `return new Promise() { ... }`)
> **Avoid:** Use of `async / await`

More facts on Cypress Commands:
* Each Cypress command (and chain of commands) returns immediately. 
* All commands get appended to a queue of commands to be executed at a later time. 

*Example*
*Avoid*
```javascript
// DONT DO THIS. IT DOES NOT WORK
// THE WAY YOU THINK IT DOES.

const button = cy.get('button')

const form = cy.get('form')

// nope, fails
button.click()
```

*Recommended*
```javascript
// chain
cy.get('button').click();

// then
cy.get('button').then(($btn) => {
  // $btn is the object that the previous
  // command yielded us
  const txt = $btn.text()
});
// or assert
cy.get('button').should('have.text', 'Submit');

// chain and .as()
cy.get('.c-address-read-only__line-item')
        .contains(addressCardIdentifier)
        .closest('.c-addresses__card-header')
        .as('targetAddress');

    cy.get('@targetAddress')
        .find('.c-popper__default-control > button')
        .click();
```
## Setting a global baseUrl
Adding a `baseUrl` in your configuration allows you to omit passing the baseUrl to commands like `cy.visit()` and `cy.request()`. Cypress assumes this is the url you want to use.
```json
// cypress.json
{
  "baseUrl": "http://localhost:8080"
  "ignoreTestFiles": "*.js"
}
```
## Setting Environment variables
5 different ways to set environment variables
* Set in `cypress.json`
```json
// cypress.json
{
  "projectId": "128076ed-9868-4e98-9cef-98dd8b705d75",
  "env": {
    "foo": "bar",
    "some": "value"
  }
}
```
Test file
```json
Cypress.env()       // {foo: 'bar', some: 'value'}
Cypress.env('foo')  // 'bar'
Cypress.env('some') // 'value'
```
* Create a `cypress.env.json`
```json
// cypress.env.json
{
  "host": "veronica.dev.local",
  "apiServer": "http://localhost:8888/api/v1/"
}
```
Test file
```json
Cypress.env()             // {host: 'veronica.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host')       // 'veronica.dev.local'
Cypress.env('apiServer') // 'http://localhost:8888/api/v1/'
```
* Export as `CYPRESS_*`
>Cypress will strip off the `CYPRESS_`, camelcase any keys and automatically convert values into `Number` or `Boolean`
```js
// Changes the `baseUrl` configuration value / It does not set env var in `Cypress.env()`
$ export CYPRESS_BASE_URL=https://edge-selfcare.storefront.ascendon.tv

// OR

$ export CYPRESS_baseUrl=https://edge-selfcare.storefront.ascendon.tv
```
```js
// 'foo' does not match config. Sets env var in `Cypress.env()`
export CYPRESS_FOO=bar

// Test file
Cypress.env('foo');   // bar
```
* Pass in the CLI as `--env`
```js
cypress run --env host=kevin.dev.local,apiServer=http://localhost:8888/api/v1
```

## Unnecessary Waiting
> **Anti-Pattern:** Waiting for arbitrary time periods using `cy.wait(Number)`.
> **Best Practic:** Use route aliases or assertions to guard Cypress from proceeding until an explicit condition is met.

*Examples:*
##### Unnecessary wait for `cy.request()`
```javascript
cy.request('http://localhost:8080/db/seed')
cy.wait(5000)     // <--- this is unnecessary
```
Why?
* `cy.request()` command will not resolve until it receives a response from your server (i.e the next step in the queue is executed only after the previous step has completed)
* Adding the wait here only adds 5 seconds after the cy.request() has already resolved

##### Unnecessary wait for `cy.visit()`
```javascript
cy.visit('http://localhost/8080')
cy.wait(5000)     // <--- this is unnecessary
```
Why?
*  `cy.visit()` resolves once the page fires its `load` event

##### Unnecessary wait for `cy.get()`
```javascript
cy.server()
cy.route('GET', /users/, [{ 'name': 'Maggy' }, { 'name': 'Joan' }])
cy.get('#fetch').click()
cy.wait(4000)     // <--- this is unnecessary
cy.get('table tr').should('have.length', 2)
--------------------------------------------------------------------
// Alternatvely a better solution
cy.server()
cy.route('GET', /users/, [{ 'name': 'Maggy' }, { 'name': 'Joan' }]).as('getUsers')
cy.get('#fetch').click()
cy.wait('@getUsers')     // <--- wait explicitly for this route to finish
cy.get('table tr').should('have.length', 2)
```
Why?
* `cy.get()` automatically retries until the table’s tr has a length of 2.*


Cypress has default Timeouts
```json
pageTimeout => 60000ms => 60sec  // cy.visit(), cy.go()
responseTimeout=>30000ms => 30sec // cy.wait, cy.fixture(), cy.request() etc
```

## Use .find() / .children() for performance gain
> Refer to `Selecting Elements` above
> 

```javascript
// Avoid
cy.get('#main-content > .article');

// Recommended
// travels a single level down the DOM tree to find `.article` element
cy.get('#main-content').children('.article')
```

```javascript
// Avoid
cy.get('#main-content .article');

// Recommended
// travels a single level down the DOM tree to find `.article` element
cy.get('#main-content').find('.article')
```
## Assertions

##### Examples of Assertions
```javascript
// retry until we find 3 matching <li.selected>
cy.get('li.selected').should('have.length', 3)

// retry until this button is visible
cy.get('button').should('be.visible')

// retry until this span does not contain 'click me'
cy.get('a').parent('span.help').should('not.contain', 'click me')

// If built-in assertions are not enough, you can easily write your own assertion function 
// and pass it as a callback to the .should() command
cy.get('div')
  .should(($div) => {
    expect($div).to.have.length(1)

    const className = $div[0].className

    // className will be a string like "main-abc123 heading-xyz987"
    expect(className).to.match(/heading-/)
  })
```
More on [Assertion](https://docs.cypress.io/guides/references/assertions.html#Chai)
##### When to Assert?
> Sometimes the best test may make no assertions at all

*Example:*
```javascript
cy.visit('/home')

cy.get('.main-menu')
  .contains('New Project')
  .click()

cy.get('.title')
  .type('My Awesome Project')

cy.get('form')
  .submit()
```
Without a single explicit assertion, there are many ways this test can fail. Here's a few:
* The initial `cy.visit()` could respond with something other than success.
* Any of the `cy.get()` commands could fail to find their elements in the DOM
* The input we want to `.type()` into could be disabled
* The element we want to `.click()` on could be covered by another element

> With Cypress, you don’t have to assert to have a useful test. Even without assertions, a few lines of Cypress can ensure thousands of lines of code are working properly across the client and server!

But why?
> This is because many commands have a built in [Default Assertion](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Default-Assertions) which offer you a high level of guarantee.
 

## Understanding Cypress
##### What happens when Cypress can’t find any matching DOM elements from its selector?
1. The element is found
```javascript
cy
  // cy.get() looks for '#element', repeating the query until...
  .get('#element')

  // ...it finds the element!
  // You can now work with it by using .then
  .then(($myElement) => {
    doSomething($myElement)
  })
```
2. A set timeout is reached
```javascript
cy
  // cy.get() looks for '#my-nonexistent-selector', repeating the query until...
  // ...it doesn't find the element before its timeout.
  // Cypress halts and fails the test.
  .get('#element-does-not-exist')

  // ...this code is never run...
  .then(($myElement) => {
    doSomething($myElement)
  })
```
> Cypress wraps all DOM queries with robust retry-and-timeout logic that better suits how real web apps work


## Visit a page
Example: 
`And I go to the "Addresses" Page`


```javascript
cy.visit('/account/settings/addresses');
```
VS

```javascript
cy.get('.c-settings-link').click();
cy.get('.c-addresses-link').click();
```

# Given / When / Then Phrases

*Avoid*
```js
Scenario: Logging in into selfcare app with correct credentials
    Given I enter username
    And I enter password
    When I click on "Sign In" button
    Then I should be on "overview" page
```

*Recommended*

```js
Scenario: Logging in into selfcare app with correct credentials
    Given I am on the login page
    And I enter a valid user credential
    When I click on "Sign In" button
    Then I should be on the "Account" landing/overview page
```

# Folder structure (Recommended)
> `Cypress preprocessor` looks for step definitions:
> 1) In the folder as the feature file name 
> 2) Up the folder hierarchy
> 
>*Examples:* 
>Folder name `Settings` should match its feature filename `Settings.feature`.
>
>`Settings.feature` has access to the step definitions defined in `commonSteps.js` and so does `Addresses.feature`

```json
|- integration
|- - - - common
|- - - - - - - - commonSteps.js
|- - - - - - - - before.js
|- - - - account
|- - - - - - - - Addresses
|- - - - - - - - - - - - addressesStep.js
|- - - - - - - - - - - - after.js       // <= Avoid
|- - - - - - - - - - - - before.js
|- - - - - - - - - - - - addressesHelper.js
|- - - - - - - - Settings
|- - - - - - - - - - - - settingsStep.js
|- - - - - - - - - - - - after.js       // <= Avoid
|- - - - - - - - - - - - before.js
|- - - - - - - - - - - - settingsHelper.js
|- - - - - - - - Addresses.feature
|- - - - - - - - Settings.feature
```
Use of after or afterEach hook is an `Anti-Pattern`

![after-after-each-anitpattern.png](D:/Documents/Boostnote/Storage/after-after-each-anitpattern.png)

```javascript
// there is no guarantee that this code will run
afterEach(function () {
  cy.resetDb()
});
```
Why? 
* Because if you refresh Cypress in the middle of the test - you will have built up partial state in the database
* Code put in a `before` or `beforeEach` hook will always run prior to the test - even if you refreshed Cypress in the middle of an existing one!

##### Configuration
```JSON
// .cypress-cucumber-reprocessorrc
{
  "nonGlobalStepDefinitions": true
}
```
## Network Request
##### Stubbing
You need two things:
1. Start a `cy.server()`
2. Provide a `cy.route()`

```js
cy.server()           // enable response stubbing
cy.route({
  method: 'POST',      // Route all POST requests
  url: '**/subscriber/retrieveSubscriberOfferings',    // match the URL
  response: []        // and force the response to be: []
})
```
Using Fixtures
```js
cy.server()

// we set the response to be the activites.json fixture
cy.route('GET', '**/subscriber/retrieveSubscriberOfferings', 'fixture:offerings.json');
```
Additionally reference aliases within responses
```js
cy.server()

cy.fixture('activities.json').as('activitiesJSON')
..
..
cy.route('GET', 'activities/*', '@activitiesJSON')
```

## Extras
### Custom commands
*Before*
```js
Given(/^I have logged in as "([^"]*)"$/, (username) => {
    cy.route({
        method: 'POST',
        url: '**/subscriber/RetrieveSubscriber',
        onResponse: ({ response }) => {
            const { body: { Subscriber: { Id } } } = response;
            store.set('SubscriberId', Id);
        }, 
    });

    cy.get('.c-link.c-footer-navItem').contains('Environment').click();
    cy.get('#environment').select(environment);
    cy.get('#systemId').select(businessUnit);
    cy.get('button').contains('Submit').click();
    cy.get('#login').type(username);
    cy.get('#password').type(password);
    cy.get('button')
        .contains('Sign In')
        .click();
});
```
*After*

```js
Given(/^I have logged in as "([^"]*)"$/, (username) => {
    cy.login(username);
});
```

Custom `login` command
```js
// support/commands.js   (file name can be anything)
Cypress.Commands.add('login', (username) => {
    // login steps
});
```
> Don't make everything a custom command
##### When to create Custom commands?
* You need to describe behavior that is desirable across many of your tests
  * Eg: `cy.setup()` or `cy.login()` or `cy.get('.dropdown').dropdown('Apples')`

*Note: If a custom command is used by only one scenario or a feature, better replace it with a regular old `javascript function`*

##### Overwrite existing commands
```js
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
    // do something extra everytime you use `cy.visit()`
    
    // originalFn is the existing `visit` command that you need to call
    // and it will receive whatever you pass in here.
    //
    // make sure to add a return here!
    return originalFn(url, options);
});
```

### Typescript support
See the [cypress-example-todomvc](https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense) repository for a working example

