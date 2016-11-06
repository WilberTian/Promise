(function(exports){
    var isThenable = function(obj){
        return obj && typeof obj["then"] === "function";
    }
    
    var isFunction = function(obj){
        return typeof obj === "function";
    }

    function Promise(resolver){

        if(typeof resolver !== "function"){
            throw new TypeError("Need a resolver function");
        }
        
        if(!(this instanceof Promise)) {
            return new Promise(resolver);
        }
    
        var self = this;
        self._status = "pending";
        self._resolves = [];
        self._rejects = [];
        self._value;
        self._reason;
        
        resolver(function(value){
                self.resolve(value);
            }, function(reason){
                self.reject(reason);
            });
    }
    
    Promise.prototype.resolve = function(value){
        this._value = value;

        var callback;
        while(callback = this._resolves.shift()){
            callback.call(null, value);
        }
        
        this._status = "fulfilled";
    };

    Promise.prototype.reject = function(reason){
        this._reason = reason;
        
        var callback;
        while(callback = this._rejects.shift()){
            callback.call(null, reason);
        }
        
        this._status = "rejected";
    };
    
    Promise.prototype.then = function(onFulfilled, onRejected){
        var self = this;
        
        return new Promise(function(resolve, reject){
            
            var _handler = function(ret, func){
                if(isThenable(ret)){
                    ret.then(function(value){
                            resolve(value);
                        }, function(reason){
                            reject(reason);
                        });
                }
                else{
                    func(ret);
                }
            }
            
            var onFulfilledCallback = function(value){
                var ret = isFunction(onFulfilled) && onFulfilled(value) || value;
                _handler(ret, resolve);
            };
            
            var onRejectedCallback = function(reason){
                var ret = isFunction(onRejected) && onRejected(reason) || reason;
                _handler(ret, reject);
            }
            
            if(self._status === "pending"){
                self._resolves.push(onFulfilledCallback);
                self._rejects.push(onRejectedCallback);
            }
            else if(self._status === "fulfilled"){
                onFulfilledCallback(self._value);
            }
            else if(self._status === "rejected"){
                onRejectedCallback(self._reason);
            }
                
        });
    };
        
    exports.Promise = Promise    
        
})(this);
