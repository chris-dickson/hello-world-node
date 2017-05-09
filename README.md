# Hello-World-Node

> A step-by-step guide to setting up a public NPM module with CircleCI continuous integration and deployment


## Setting up NPM publishing to an Organization

1) Create user account on https://npmjs.com

2) Once your account is created, create an organization.  For example '@my-organization'

3) Initialize it as an NPM project and call it "hello-world-node":
```
    npm init
```
    
4) In your `package.json`, ensure that you have the `name` field set to scope the package to your organization:
```
    "name": "@my-organization/hello-world-node"
```
    
5) Create an `index.js` file with a simple export:
```
    exports.printMsg = function() {
        console.log("Hello world, from node");
    }
```
  
6) Authorize your NPM user account on this machine for pushing to your NPM repository:
```
    npm login
```
  
7) Publish version 1.0.0 of the package to public NPM:
```
    npm publish --access public
``` 
  
## Testing the Published Package

1) In a separate directory, create another NPM project called "hello-world-node-consumer" by running:
```
    npm init
```
    
2) Install your published packaged:
```
    npm install --save @my-organization/hello-world-node
``` 
   
4) In your `index.js` file, add the following:
```
    var hello = require('@my-organization/hello-world-node');
    
    hello.printMsg();
```
    
5) Running `node index.js` should output the text:
```
    "Hello world, from node"
```    

# Setting up CircleCI

1) Create a Github respository for your "hello-world-node" project and push the existing source code

2) Go to https://circleci.com/ and sign-up, using Github authorization

3) Ensure that your "hello-world-node" is the only project imported

4) CircleCI automatically detects that this is an NPM project and immediately starts a build.  You'll notice the builds failed because tests did not pass.  By
default, NPM will have the following script for newly initialized projects:
```
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
```      
It will execute the `test` script, and fail on any non-zero return code.

5) Install gulp in your "hello-world-node" project:
```
    npm install gulp
```    

6) Add a `gulpfile.js` to run a test:
```
    var gulp = require('gulp');
    
    gulp.task('test',function(done) {
        console.log("Run your tests here, any non-zero exit code causes CirlcleCI to fail");
        process.exit(0);
    });
```
    
7) CircleCI needs to have Gulp install globally to run it.  Create a `circle.yml` file to install Gulp before each build:
```
    dependencies:
      pre:
        - npm install -g gulp
```

8) Commit and push the changes to Github, and your build should now pass. 

## Continuous Deployment to NPM

1) Get the NPM authorization token from the NPM resource file:
```
    cat ~/.npmrc
```    
It should look like the following:
```
    //registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
    
2) In the project settings for your CircleCI project, add the following environment variable:
```
    name = NPM_TOKEN
    value = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
    
3) Modify your `circle.yml` file to look like the following.  It will automatically push tagged builds to NPM:
```
    dependencies:
      pre:
        - echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
        - npm install -g gulp
    deployment:
      npm:
        tag: /v[0-9]+(\.[0-9]+)*/
        commands:
          - npm publish --access public
```

4) Create a new version of "hello-world-node" by running:
```
    npm version 1.0.1
```
    
5) Push to Github and follow tags:
```
    git push --follow-tags
```
    
6) Once the build completes, version 1.0.1 of "@my-organization/hello-world-node" should be deployed to NPM