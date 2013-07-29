# Mongoose stripe customer plugin

[![Build Status](https://travis-ci.org/AlexDisler/mongoose-stripe-customer.png)](https://travis-ci.org/AlexDisler/mongoose-stripe-customer)

Mongoose plugin to manage stripe plans and recurring payments.
Add it to your users/accounts table to store:
- stripe customer id
- stripe plan id
- last 4 digits of the payment method (for display purposes)
- next stripe plan billing date (for display purposes)

# Requirements

* Node.js
* mongoDB
* Stripe account

# API

### stripe customer id

- ```setStripeCustomerId(customerId)```
- ```getStripeCustomerId()```

### stripe plan
- ```setPlan(plan)```
- ```getPlanName()```
- ```getPlanPrice()```
- ```isFreePlan()```
- ```isNoPlan()```
- ```isValidPurchasePlan(plan)```
- ```compareToPlan(plan)```

### last 4 digits of the payment method
- ```setLast4(last4)```
- ```getLast4()```
- ```isCardOnFile()```
- ```resetCard()```

### next stripe plan billing date
- ```setNextBillingDate(billingDate)```
- ```getNextBillingDate()```

# Usage

Install

    $ npm install mongoose-stripe-customer

Test (requires mongodb installed locally)

    $ npm test

Example

```js
// load
var stripeCustomer = require('mongoose-stripe-customer');

// define your schema
var MySchema = new mongoose.Schema({...});

// define plans
var plansPricing = {
    'BASIC' : { name : 'Basic', price : 9.99 },
    'TEAM'  : { name : 'Team',  price : 19.99 },
    'GOLD'  : { name : 'Gold',  price : 29.99 }
};

// add the plugin
MySchema.plugin(stripeCustomer, { 

    // the plans you defined
    plans : plansPricing,

    // set the default plan
    defaultPlan : stripeCustomer.plans.FREE,

    // a callback for when a new plan is assigned
    onPlanGiven : function (doc, plan) {
        // do something
    }

});
```
