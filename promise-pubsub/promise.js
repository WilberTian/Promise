Function.prototype.extend = function(source) {
	for (var property in source) {
    	this.prototype[property] = source[property];
	}
}

Promise.extend(Pubsub);


function Promise(resolver) {
	var self = this;

	self.state = 'pending';

	resolver(function(val){
            self.resolve(val);
        }, function(err){
            self.reject(err);
        });
}

Promise.prototype.resolve = function(val) {
	this.state = 'fulfilled';
	this.publish('success', val);
}

Promise.prototype.reject = function(err) {
	this.state = 'rejected';
	this.publish('error', err);
}

Promise.prototype.then = function(onFulfilled, onRejected) {
	if(typeof onFulfilled === 'function') {
		this.subscribe('success', onFulfilled);
	}

	if(typeof onRejected === 'function') {
		this.subscribe('error', onRejected);
	}

	return this;
}
