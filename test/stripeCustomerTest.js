var mongoose = require('mongoose'),
    should   = require('should'),
    sinon    = require('sinon'),
    utils    = require('./utils'),
    _        = require('Underscore');

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
        var cusId = '12345678';
        user.setStripeCustomerId(cusId);
        user.getStripeCustomerId().should.equal(cusId);
    });

    it('should set the active plan', function () {
        var plan = 'TEAM';
        user.setPlan(plan);
        user.getPlan().should.equal(plan);
    });

    it('should return the name and price of the active plan', function () {
        modelUser.getPlanName(plan).should.equal('Team');
        modelUser.getPlanPrice(plan).should.equal(19.99);
    });

    it('should indicate if there is no plan or if the plan is free', function () {
        // ...
    });

    it('should check if a given plan is valid', function () {
        modelUser.isValidPurchasePlan('GOLD').should.be.true;
    });

    it('should compare plans', function () {
        /**
            // the same plan returns 0
            account.compareToPlan(Account.FREE).should.equal(0);
            account.plan = Account.TEAM;
            account.save(function () {
                account.compareToPlan(Account.TEAM).should.equal(0);
                // comparison to a lower plan is a downgrade
                account.compareToPlan(Account.BASIC).should.equal(-1);
                // comparison to a higher plan is an upgrade
                account.compareToPlan(Account.GOLD).should.equal(+1);
                // change the plan back
                done();
            });
         */
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
        // ...
    });

    after(function(done){
        utils.cleanDb(done);
    });

});
