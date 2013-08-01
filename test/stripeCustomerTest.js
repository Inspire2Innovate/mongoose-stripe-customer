var mongoose = require('mongoose'),
    should   = require('should'),
    sinon    = require('sinon'),
    utils    = require('./utils'),
    _        = require('underscore');

describe('stripeCustomerTest', function () {

    var user, modelUser;
    var UserSchema = utils.createDummySchema();
    before(function(done){
        utils.setDb(function () {
            modelUser = mongoose.model('users', UserSchema);
            user = new modelUser();
            user = utils.setFakeUserData(user);
            user.save(function (usr, arr) {
                done();
            });
        });
    });


    beforeEach(function (done) {
        done();
    });

    it('should add the stripe property to the schema', function () {
        user.should.have.property('stripe');
    });

    it('should get/set stripe customerId', function () {
        var custId = 'cus_1234567ABCDEFG';
        user.setStripeCustomerId(custId);
        user.getStripeCustomerId().should.equal(custId);
    });

    it('should set the active plan', function () {
        var plan = 'TEAM';
        user.setPlan(plan);
        user.getPlan().should.equal(plan);
    });

    it('should return the name and price of the active plan', function () {
        var plan = 'GOLD';
        user.setPlan(plan);
        user.getPlan().should.equal(plan);
        user.getPlanName().should.equal('Gold');
        modelUser.getPlanPrice(plan).should.equal(29.99);
    });

    it('should return the name of any preset given paid plan', function () {
        modelUser.getPlanName('BASIC').should.equal('Basic');
        modelUser.getPlanName('TEAM').should.equal('Team');
        modelUser.getPlanName('GOLD').should.equal('Gold');
    });

    it('should indicate if there is no plan or if the plan is free', function () {
        user.setPlan('FREE');
        user.isFreePlan().should.be.true;
        user.setPlan('NONE');
        user.isNoPlan().should.be.true;
    });

    it('should check if a given plan is valid', function () {
        modelUser.isValidPurchasePlan('GOLD').should.be.true;
    });

    it('should compare plans', function () {
        user.setPlan('TEAM');
        user.compareToPlan('BASIC').should.equal(-1);
        user.compareToPlan('TEAM').should.equal(0);
        user.compareToPlan('GOLD').should.equal(1);
    });

    it('should set/get last 4 digits of the payment method', function () {
        var last4 = '1234';
        user.setLast4(last4);
        user.getLast4().should.equal(last4);
    });

    it('should indicate if there is a card on file', function () {
        user.isCardOnFile().should.be.true;
    });

    it('should reset the card on file', function () {
        user.resetCard();
        user.isCardOnFile().should.be.false;
    });

    it('shuold set/get the next billing date', function () {
        var now = new Date();
        user.setNextBillingDate(now);
        user.getNextBillingDate().should.equal(now);
    });

    after(function(done){
        utils.cleanDb(done);
    });

});
