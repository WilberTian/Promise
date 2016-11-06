### Promise简介

Promise 是一种对异步操作的封装，可以通过独立的接口添加在异步操作执行成功、失败时执行的方法。

Promise规范是CommonJS规范之一，而Promise规范又分了好多种，比如 Promises/A、Promises/B、Promises/Kiss等等。现在主流的规范是[Promises/A+](https://promisesaplus.com/)。


### 一个简单的例子
例子中包含了逛街、吃饭、回家这三个任务，前一个任务的结果会决定后面的任务。  
通过这个简单的例子就可以对Promise有个简单、直观的认识。  


    function shopping() {
        return new Promise(function(resolve, reject) {
            console.log("周末啦，去逛街！！！")
    
            setTimeout(function() {
                if (Math.random() > 0.7) {
                    console.log("买了好多衣服，爽 - ^_^")
                    resolve("happy");
                } else {
                    console.log("为什么一件合适的都没有 - >_<")
                    resolve("unhappy");
                }
            }, 2000);
        });
    }
    
    function eating(mood) {
        return new Promise(function(resolve, reject) {
            
            setTimeout(function() { 
                console.log("逛完了，找地方吃饭");
            }, 1000);
            
            
            var rate;
            mood === "happy"?rate=0.1:rate=0.9;
            
            setTimeout(function() {
                if (Math.random() > rate) {
                    console.log("很不错哦，晚餐开始 - ^_^");
                    resolve("full");
                } else {
                    console.log("唉，没什么胃口 - >_<");
                    resolve("empty");
                }
        
            }, 3000);
        });
    }
    
    function haveFun() {
        shopping()
        .then(function(value) {
                return eating(value);
            })
        .then(function(value) {
                setTimeout(function() {
                    if(value === "full") {
                        console.log("吃饱睡个美容觉！！！");
                    }
                    else {
                        console.log("肚子好饿，睡不着。。。");
                    }
                }, 1000);
            });
    }

执行结果：   

![promise](https://cloud.githubusercontent.com/assets/5880320/13242851/ebfa8184-da33-11e5-8362-6a5dd1ab62c1.PNG)

    
### 深入Promise的四个例子
对于下面四个例子，如果想要得到正确的答案，就需要对Promise规范的内容比较了解。  
其中，第二个和第三个例子展示了特殊的方式使用Promise中可能遇到的坑。


    function doSomething() {
        console.log("doSomething(): start");
        return new Promise(function (resolve) {
            setTimeout(function () {
            console.log("doSomething(): end");
            resolve();
            }, 1000);
        });
    }
    
    function doSomethingElse() {
        console.log("doSomethingElse(): start");
        return new Promise(function (resolve) {
            setTimeout(function () {
            console.log("doSomethingElse(): end");
            resolve();
            }, 1000);
        });
    }
    
    function finalHandler() {
        console.log("finalHandler(): start");
        return new Promise(function (resolve) {
            setTimeout(function () {
            console.log("finalHandler(): end");
            resolve();
            }, 1000);
        });
    }
    
    function example1() {
        doSomething()
        .then(function () {
                return doSomethingElse();
            })
        .then(finalHandler);
    }
    
    function example2() {
        doSomething()
        .then(function () {
                doSomethingElse();
            })
        .then(finalHandler); 
    }
    
    function example3() {
        doSomething()
        .then(doSomethingElse())
        .then(finalHandler);
    }
    
    function example4() {
        doSomething()
        .then(doSomethingElse)
        .then(finalHandler);
    }
    
    
`example1()`结果：
<pre>
doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
</pre>

`example2()`结果：
<pre>
doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                  finalHandler(undefined)
                  |------------------|
</pre>

`example3()`结果：
<pre>
doSomething
|-----------------|
doSomethingElse(undefined)
|---------------------------------|
                  finalHandler(resultOfDoSomething)
                  |------------------|
</pre>

`example4()`结果：
<pre>
doSomething
|-----------------|
                  doSomethingElse(resultOfDoSomething)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
</pre>


### Promise/A+简单实现

对于Promise规范，一定要抓住下面几个重点：  

1. promise有三种状态，等待（pending）、已完成（fulfilled）、已拒绝（rejected） 

2. promise的状态只能从“等待”转到“完成”或者“拒绝”，不能逆向转换，同时“完成”和“拒绝”也不能相互转换  

3. promise必须有一个then方法，而且要返回一个promise，供then的链式调用，也就是可thenable的  

4. then接受俩个回调(成功与拒绝)，在相应的状态转变时触发，回调可返回promise，等待此promise被resolved后，继续触发then链  



根据上面的几个点，就可以实现一个简单的Promies，具体实现参考Promise.js。  
基于这个版本的Promise简单实现，同样可以运行上面的例子。