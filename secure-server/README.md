# CLIChat Secure Server (secure-server)
CLIChat Secure Server has more authorization features and other configurable security features.

## SAUTH2 / Secure Auth (v)2
SAUTH2 introduces new user and bot authentication. 
### User Authentication
Users are now authenticated with generic tokens and temporary tokens. Here's how it works:
- User will log in with `[ 'auth', { username, token } ]` (token is generic token)
- A web page will be created and sent to the client as `[ 'authmsg', 'SERVERIP/id' ]`
- The user then goes to that link and are given an 100 character long token with lowercase characters, uppercase characters, numbers and a period/full stop (.)
- The user then sends `[ 'tokenauth', tok ]` (tok is temporary token)
- The web page text is then changed, so the token can no longer be retrieved
This entire process is built to prevent unauthorized bots from connecting. <br>Obviously, it's still possible to crack a bot through, but its painfully difficult. <br>
TLDR: Login -> Web page created with token -> User sends token -> Web page removed

### Bot Authentication
Bots are now authenticated with server-set bot tokens and usernames. Here's how it works:
- Server owner will set the bot username and token server side
- Bot will login with `[ 'botauth', { botusername, bottoken } ]`
- Bot recieves id and join messages
- Bot is authorized
The API is currently the same as the main servers (only sending messages) however, I'm going to start working on APIv2 soon to add banning, a permissions system etc.

## Significant Differences
- Authorization requires a generic token and a temporary token.
- 1 User Per Token (1UPT) added.
- **Secure Server only supports 1 port per file, while "Server" supports multiple ports.** (this is because of token adding)
- Secure Server default port is port 70.

## Other stuff
- You can set tokens with the `tokens` object. **Do not set `inuse` to true for any of your tokens if you have 1UPT enabled.**
- 1UPT is enabled by default
- You can enable or disable 1UPT.
- Secure Server does not utilise WSS, it still utilises WS ([Heres the difference](https://portswigger.net/web-security/websockets/what-are-websockets#:~:text=The%20wss%20protocol%20establishes%20a,protocol%20uses%20an%20unencrypted%20connection.&text=At%20this%20point%2C%20the%20network,WebSocket%20messages%20in%20either%20direction.)), however we may work towards using WSS in the future.


## Possible issues with API (custom clients, api wrappers, bots)
- Auth is `['auth', { ip, username, token }]` NOT `['auth', { ip, username }]`.
- Custom Clients might need a `secure connect` option, if that is enabled, prompt for a token.
- If 1UPT is enabled on a server then bots may struggle to connect without a token provided from the server owner (this is intentional).

## How to setup Secure Server
_This walkthrough presumes you have some experience with normal servers._
- Download the source code
- Set the port (there is only one port - default is 70)
- Edit `secureconfig.json` to your liking.
- Start the server.
<br>
We recommend that you notify your users that you are using a Secure Server, as the new official client (`secure-client`) asks if the server is secure. 
