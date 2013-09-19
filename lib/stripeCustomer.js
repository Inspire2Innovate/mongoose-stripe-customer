var _      = require('underscore');
var moment = require('moment');

var NONE = 'NONE';
var FREE = 'FREE';

module.exports = exports = function stripeCustomer (schema, options) {

    schema.add({ 
        stripe : {
            customerId      : String,
            plan            : { type  : String, enum : options.allPlans, default : options.defaultPlan },
            last4           : String,
            nextBillingDate : Date,
        }
    });

    // extract paid plans keys
    var paidPlans = _(options.plans).keys();

    // array holding all plans - including free and none
    // sorted from cheapest to the most expensive
    var allPlans = _(paidPlans).clone();
    allPlans.unshift(FREE);
    allPlans.unshift(NONE);

    /**
     * Set the stripe customer id
     *
     * @param {String} customerId
     * @return {Schema}
     */
    schema.methods.setStripeCustomerId = function (customerId) {
        this.stripe.customerId = customerId;
        return this;
    };

    /**
     * Get the stripe customer id
     *
     * @rerturn {String}
     */
    schema.methods.getStripeCustomerId = function () {
        return this.stripe.customerId;
    };
        
    /**
     * Set the used plan
     *
     * @param {String} plan
     * @return {Schema}
     */
    schema.methods.setPlan = function (plan) {
        this.stripe.plan = plan;
        return this;
    };

    /**
     * Get the used plan
     *
     * @return {String}
     */
    schema.methods.getPlan = function () {
        return this.stripe.plan;
    };

    /**
     * Get plan name - returns the name of the current set plan
     *
     * @return {String | Int}
     */
    schema.methods.getPlanName = function () {
        if(!_(options.plans).has(this.stripe.plan)) return '';
        return options.plans[this.stripe.plan].label;
    };

    /**
     * Static get plan name - returns the name of a given paid plan
     *
     * @param string plan identifier
     * @return {String | Int}
     */
    schema.statics.getPlanName = function (plan) {
        if(schema.statics.isValidPurchasePlan(plan)) {
           return options.plans[plan].label;
        } else {
            return -1;
        }
    };

    /**
     * Get plan price
     *
     * @param {String} plan identifier
     * @return {Float | Int}
     */
    schema.statics.getPlanPrice = function (plan) {
        if(schema.statics.isValidPurchasePlan(plan)) {
           return options.plans[plan].price;
        } else {
            return -1;
        }
    };

    /**
     * Is this account on the free plan?
     *
     * @return {Boolean}
     */
    schema.methods.isFreePlan = function () {
        return Boolean(this.stripe.plan === FREE);
    };

    /**
     * Is no plan set?
     *
     * @return {Boolean}
     */
    schema.methods.isNoPlan = function () {
        return Boolean(this.stripe.plan === NONE);
    };

    /**
     * Is this a valid plan for purchase?
     *
     * @param {string} plan
     * @return {Boolean}
     */
    schema.statics.isValidPurchasePlan = function (plan) {
        return (_(paidPlans).indexOf(plan) >= 0);
    };

    /**
     * Compare current plan to another to specify if switching to it
     * would be a downgrade or upgrade
     *
     * @return {Int} - 3 possible results:
     * -1 - downgrade
     *  0 - same plan / undefined plan
     *  1 - upgrade
     */
    schema.methods.compareToPlan = function (plan) {
        if(_(plan).isUndefined() || _(allPlans).indexOf(this.stripe.plan) < 0 || plan === this.stripe.plan) {
            return 0;
        }
        return (_(allPlans).indexOf(plan) < _(allPlans).indexOf(this.stripe.plan)) ? -1 : +1 ;
    };

    /**
     * Set last 4 digits of the credit card
     *
     * @param {String} last4
     * @return {Schema}
     */
    schema.methods.setLast4 = function (last4) {
        this.stripe.last4 = last4;
        return this;
    };

    /**
     * Get last 4 digits of the credit card
     *
     * @return {String | Null}
     */
    schema.methods.getLast4 = function () {
        if(this.isCardOnFile()) {
            return this.stripe.last4;
        }
        return null;
    };

    /**
     * Is there a card on file?
     *
     * @return {Boolean}
     */
    schema.methods.isCardOnFile = function () {
        return (_(this.stripe.last4).isString() && (this.stripe.last4.length === 4));
    };

    /**
     * Reset card
     *
     * @param {Function} fn
     */
    schema.methods.resetCard = function (fn) {
        this.stripe.last4 = '';
        this.save(fn);
    };

    /**
     * Set the next billing date
     *
     * @param {Date}
     * @return {Schema}
     */
    schema.methods.setNextBillingDate = function (nextDate) {
        this.stripe.nextBillingDate = nextDate;
        return this;
    };

    /**
     * Get the next billing date
     *
     * @return {Date | Boolean}
     */
    schema.methods.getNextBillingDate = function () {
        return (this.stripe.nextBillingDate !== undefined) ? this.stripe.nextBillingDate : false;
    };

    schema.pre('save', function (next) {
        this._isNew = this.isNew;
        this._isPlanIsBeingUpdated = this.isDirectModified('stripe.plan');
        next();
    });

    schema.post('save', function () {
        if (this._isNew) {
            // if this is a new object
            options.onPlanGiven && options.onPlanGiven(this, this.stripe.plan);
        } else if (this._isPlanIsBeingUpdated) {
            // if this is not a new object and the plan was changed
            options.onPlanGiven && options.onPlanGiven(this, this.stripe.plan);
        }
    });
};

module.exports.NONE = NONE;
module.exports.FREE = FREE;
