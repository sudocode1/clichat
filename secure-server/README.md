# CLIChat Secure Server (secure-server)
CLIChat Secure Server has more authorization features and other configurable security features.

## Significant Differences
- Authorization requires a token.
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
