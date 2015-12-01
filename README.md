# Visualmath
Dynamic and interactive visualizations of foundations of Algebraic Geometry.

##DEMO

[Go to Demo](http://visualmath.meteor.com/vm)

##Installing 

To use VisualMath served in your computer you need to [install the latest official Meteor] (https://www.meteor.com/install) release from your terminal:

``` curl https://install.meteor.com/ | sh ```

Before running Meteor, it is necessary to check if MongoDB is installed, writing the following command from the directory *three*

``` mongod ```

If there is an error,  MongoDB runs on most platforms and supports 64-bit architecture for production use and both 64-bit and 32-bit architectures for testing and you can install it from [here] (http://docs.mongodb.org/manual/installation/)

##Running

First you have to download the repository with the following command

```git clone https://github.com/samigc/visualmath.git ```

Then, go to the directory called *final* and run meteor:

``` meteor ```

The satisfactory output will be 

```
[[[[[ ~/git/visualmath/three ]]]]]    
=> Started proxy.                             
=> Started your app.                          

=> App running at: http://localhost:3000/
```
Finally, in your browser go to the server where Meteor is serving, in this case it is *http://localhost:3000/*.
