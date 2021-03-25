# CLIChat
CLIChat - Chat rooms for the command line with no signups by sudocode1 & 1s3k3b. <br>
Our official CLIChat server: `188.165.82.203:90` <br>
- [How to use](#how-to-use)
- [Writing a custom client or a bot](#writing-a-custom-client-or-a-bot)
<br>

More pages
- [Client README](https://github.com/sudocode1/clichat/blob/master/client/README.md)
- [Server README](https://github.com/sudocode1/clichat/blob/master/server/README.md)
- [Secure Server README](https://github.com/sudocode1/clichat/blob/master/secure-server/README.md)
## How to use
### Connect to a server:
- Download the source code
- Download and Install Node.js
- Locate to `/<clichatdir>/client`
- Run `npm i` (first time only) and then `node index.js`

<br>

### Host a server (or multiple servers):
_If you want to host a secure server, look at the [secure-server readme](https://github.com/sudocode1/clichat/blob/master/secure-server/README.md)._
Download the source code, navigate to `/<clichatdir>/server` and edit `index.js`, there are two options near the top of the file:
```js
// set the ports you want to host on if you need multiple servers
const ports = [90];

// set the words you want to filter from usernames and messages
const filter = ["the words you want to filter", "go here"];
```
If you want to host multiple servers, add more ports to the `ports` array. <br>
The filter should have the words you want to filter from usernames and chat. <br> <br>

To start the server, run `npm i` (first time only) and then `node index.js`

## Writing a custom client or a Bot
Writing a custom client or bot is quite simple (slightly different for [secure servers](https://github.com/sudocode1/clichat/blob/master/secure-server/README.md)).<br>
There is an official API wrapper made for Node.js: [clichat.js](https://github.com/sudocode1/clichat.js).<br>
You can also make your own API wrapper by utilising this list. 
- Everything uses pure WebSockets & JSON.
- Connect to the server using `['auth', {ip, username}]` (IP is not currently used at all)
- Messages should be sent as `['msg', {idOfUser, messageContent}]`
- Messages are recieved as the same as above
- A user disconnect is recieved as `['disconnect', username]`
- A user join is recieved as `['join', username]`
- You joining the room is recieved as `['id', yourID]`
- A server refusal is recieved as `['refusal', refusalString]` 
