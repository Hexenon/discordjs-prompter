<h1  align="center">discordjs-prompt 👋</h1>

<p align="center">
<a href="https://npmjs.com/package/discordjs-prompter">
<img  src="https://img.shields.io/npm/v/discordjs-prompter.svg?cacheSeconds=2592000"  />
</a>
<a href="https://github.com/joaquimnet/discordjs-prompter#readme" target="_blank">
<img src="https://img.shields.io/github/package-json/v/joaquimnet/discordjs-prompter/master.svg?color=yellow&cacheSeconds=2592000" alt="Version@Master" />
</a>
<a  href="https://github.com/joaquimnet/discordjs-prompter#api">
<img  alt="Documentation"  src="https://img.shields.io/badge/documentation-yes-green.svg"  target="_blank"  />
</a>
<a  href="https://github.com/joaquimnet/discordjs-prompter/blob/master/LICENSE">
<img  alt="License: MIT"  src="https://img.shields.io/badge/License-MIT-green.svg"  target="_blank"  />
</a>
</p>

Prompt for a user response using reactions or a massage.

## Examples

Message Prompt:

```javascript
const client = require('discord.js').Client();

const prompter = require('discordjs-prompter');

client.on('message', msg => {
  // Listen for a message starting with !foo

  if (msg.content.startsWith('!foo')) {
    // Prompts the user if wether they like bacon or not

    prompter
      .message(msg.channel, {
        question: 'Do you like bacon?',
        userId: msg.author.id,
        max: 1,
        timeout: 10000,
      })
      .then(responses => {
        // If no responses, the time ran out
        if (!responses.size) {
          return msg.channel.send(`No time for questions? I see.`);
        }
        // Gets the first message in the collection
        const response = responses.first();

        // Respond
        msg.channel.send(`**${response}** Is that so?`);
      });
  }
});

client.login('YOUR_BOT_TOKEN_HERE');
```

![alt text](https://i.imgur.com/nNfBXYi.gif "Answering to the bot's question.")

* * *

Reaction Prompt:

```javascript
const client = require('discord.js').Client();

const prompter = require('discordjs-prompter');

client.on('message', msg => {
  // Listen for a message starting with !bar
  if (msg.content.startsWith('!bar')) {
    // Asks if user is sure
    prompter
      .reaction(msg.channel, {
        question: 'Are you sure?',
        userId: msg.author.id,
      })
      .then(response => {
        // Response is false if time runs out
        if (!response) return msg.reply('you took too long!');
        // Returns 'yes' if user confirms and 'no' if ser cancels.
        if (response === 'yes') return msg.channel.send('You chose yes!');
        if (response === 'no') return msg.channel.send('You chose no!');
      });
  }
});

client.login('YOUR_BOT_TOKEN_HERE');
```

![alt text](https://i.imgur.com/Uhko2lY.gif "Reacting to the bot's message")

* * *

## API

### **Prompt.message(channel, options);**

Prompts the user and returns a promise that will resolve to the collection of messages collected. The messages to be collected can be configured with the options object.

-   channel: [TextChannel](https://discord.js.org/#/docs/main/stable/class/TextChannel)

-   The text channel to send the prompt to.

-   options: Object

-   The configuration object

-   **Returns: Promise&lt;[Collection](https://discord.js.org/#/docs/main/stable/class/TextChannel)&lt;[Snowflake](https://discord.js.org/#/docs/main/stable/typedef/Snowflake), [Message](https://discord.js.org/#/docs/main/stable/class/Message)>>**

**Options object:**

| Option        | Effect                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| question      | The message to be displayed. (Default: `'Yes or No?'`)                                                                                                                                       |
| prefix        | If provided, will only collect messages starting with this prefix. (Default: `null`)                                                                                                         |
| userId        | If not provided, it will, respecting the prefix option, resolve to the next message on the channel regardless of who responded.                                                              |
| timeout       | How long to wait for the messages. (Default: `30000`)                                                                                                                                        |
| failIfTimeout | By default, the promise will resolve with a list of messages regardless of reaching or not the max criteria. If this is set to true, the promise will resolve to `false`. (Default: `false`) |
| max           | How many messages to collect. (Default: `1`)                                                                                                                                                 |

* * *

### **Prompt.reaction(channel, options);**

Prompts the user with two reactions and returns a promise that will resolve to either 'yes' if the user confirms, 'no' if the user cancels or false if the time runs out.

-   channel: [TextChannel](https://discord.js.org/#/docs/main/stable/class/TextChannel)

-   The text channel to send the prompt to.

-   options: Object

-   The configuration object

-   **Returns: Promise&lt;string|boolean>**

**Options object:**

| Option   | Effect                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| question | The message to be displayed. (Default: `'Yes or No?'`)                                                                    |
| userId   | If not provided, it will resolve to the next reaction that fulfills the confirm/cancel options regardless of who reacted. |
| confirm  | The [unicode emoji](https://unicode.org/emoji/charts/full-emoji-list.html) to use as the confirm option (Default: ✅)      |
| cancel   | The [unicode emoji](https://unicode.org/emoji/charts/full-emoji-list.html) to use as the cancel option (Default: ❌)       |
| timeout  | How long to wait for the messages. (Default: `30000`)                                                                     |
