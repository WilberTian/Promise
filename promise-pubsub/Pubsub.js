var Pubsub = {
	subscribe: function(ev, callback) {
		this._callbacks || (this._callbacks = {});
		(this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
		
		return this;		
	},
    
    unsubscribe: function(ev, callback) {
        if(!ev) {
            this._callbacks = {};
            return this;
        }
        
        if(!this._callbacks) return this;
		if(!this._callbacks[ev]) return this;
        
        for(var i = 0; i < this._callbacks[ev].length; i++) {
            if(callback === this._callbacks[ev][i]) {
                this._callbacks[ev].splice(i, 1);
            }
		}
		
		return this;
    },

	publish: function() {
		var args = Array.prototype.slice.call(arguments);
		
		var ev = args.shift();
		
		if(!this._callbacks) return this;
		if(!this._callbacks[ev]) return this;
		
		for(var i = 0; i < this._callbacks[ev].length; i++) {
			this._callbacks[ev][i].apply(this, args);
		}
		
		return this;
	}

}