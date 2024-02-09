This is a simple Firefox extension to allow grouping of tabs. The main purpose is to learn how extensions are made. 

To test the extension.
- Clone the repository
- Make sure you have node.js installed.
- open a terminal instance and execute the command ```npm i``` in the location of the repo.
- run the command ```npm run build```. This will create a build folder
- Open firefox and open "about:debugging#/runtime/this-firefox". 
- You'll see a button called "Load Temporary Add-on". Click on it.
- Find the build folder created and open manifest.json.

This should load the firefox extension. Now you can use it like any other extension.

