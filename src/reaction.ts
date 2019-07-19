import { _getFilter } from './util/getFilter';
import {
  TextChannel,
  DMChannel,
  GroupDMChannel,
  Message,
  Emoji,
  ReactionEmoji,
} from 'discord.js';

export const reaction = (
  channel: TextChannel | DMChannel | GroupDMChannel,
  options: {
    question: string;
    confirm?: string | ReactionEmoji | Emoji;
    cancel?: string | ReactionEmoji | Emoji;
    userId?: string;
    timeout?: number;
  } = {
    question: 'Yes or no?',
    confirm: '✅',
    cancel: '❌',
    timeout: 30000,
  },
) => {
  if (!channel) throw new Error('Missing channel');

  // Defaults
  if (!options.question) options.question = 'Yes or no?';
  if (!options.timeout) options.timeout = 30000;
  const confirm = options.confirm ? options.confirm : '✅';
  const cancel = options.cancel ? options.cancel : '❌';
  options.confirm = confirm;
  options.cancel = cancel;

  return new Promise<'yes' | 'no' | false>(resolve => {
    // Send confirm question
    channel.send(options.question).then((msg: Message | Message[]) => {
      const message = msg instanceof Array ? msg[0] : msg;
      // Send initial reactions
      message
        .react(confirm)
        .then(() => {
          message.react(cancel);
        })
        // Catch if user responded before second reaction is dispatched
        .catch();

      // Await response
      message
        .awaitReactions(_getFilter('reaction', options), {
          max: 1,
          time: options.timeout,
          errors: ['time'],
        })
        .then(collected => {
          const reaction = collected.first();
          if (reaction.emoji.name === confirm) {
            // If confirmed, delete message and resolve
            message.delete().then(() => resolve('yes'));
          } else {
            // If cancelled, delete message and resolve
            message.delete().then(() => resolve('no'));
          }
        })
        .catch(() => {
          // If time ran out, delete message and resolve
          message.delete().then(() => resolve(false));
        });
    });
  });
};
