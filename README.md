# CLIChat
CLIChat - Chat rooms for the command line by sudocode1 & 1s3k3b.

## How to use
### Connect to a server:
- Download the source code
- Download and Install Node.js
- Locate to `/<clichatdir>/client`
- Run `npm i` (first time only) and then `node index.js`

<br><br>

### Host a server (or multiple servers):
Download the source code, navigate to `/<clichatdir>/server` and edit it, there are two options near the top of the file:
```js
// set the ports you want to host on if you need multiple servers
const ports = [90]

// set the words you want to filter from usernames and messages
const filter = ["the words you want to filter", "go here"];
```
If you want to host multiple servers, add more ports to the `ports` array. <br>
The filter should have the words you want to filter from usernames and chat. <br> <br>

To start the server, run `npm i` (first time only) and then `node index.js`
