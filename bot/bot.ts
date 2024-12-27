import { Telegraf } from 'telegraf';
import { logger } from '../log/logger';
import {
  escapeMarkdown,
  messageAllUsers,
  getUpdates,
  getQuote,
  messageOneUserByUsername,
  checkIfHasNobat,
  validatedUsersRequestedCronString,
} from '../utils/helpers';
import {
  api_token,
  privilegedUsernames,
  acceptedKeywords,
  reportKeyWord,
  globalMessageKeyWord,
  getAllUsersKeyWord,
  getPrivilegedUsernamesKeyWord,
  getUsersMessagesKeyWord,
  quoteMeKeyWord,
  messageToKeyWord,
  setDailyCurrencyCronJobStringKeyWord,
} from '../config/config';
import {
  getAllUsers,
  getAllUsersReports,
  getOneUserByUsername,
  getSingleUserReport,
  getUsersMessagesByUsername,
  insertUser,
  insertUserMessageAndReturnUserId,
  insertUsersMessage,
  setDailyCurrencyCronString,
  updateUsersDailyState,
} from '../db/db';
import { api } from '../api/api';
import { basicPrompt } from '../AI';

if (!api_token) logger.error('NO Api Token', { message: 'no api token!' });
export const bot = new Telegraf(api_token as string);

bot.start(async (ctx: any) => {
  await insertUser({ ...ctx.update.message.from });
  logger.info('Bot start', { username: ctx.update.message.from.username });
  ctx.reply('Hi! Welcome.');
});

bot.help((ctx) => {
  const replyText = `
    🌟 *Daily Workout Bot Features* 🌟

    1. **Completion Detection** 🏆
    - When the bot receives a message containing any of the following phrases: "DONE", "COMPLETE", "I'VE DONE MY WORKOUT", or "TODAY IS DONE", it will mark your daily workout as completed.

    2. **Daily Reminder** ⏰
    - The bot will send you a friendly reminder every day at 17:00 to keep you on track with your fitness goals.

    3. **Coach Privileges** 🏋️‍♂️
    - If you are a coach (a user with full access to the bot), you can use the following keywords for additional functionalities:
        - **"GLOBAL MESSAGE:"** 🌐: Use this keyword in your message to notify all members.
        - **"GET REPORT"** 📊: Use this keyword to view users' daily statuses.
    
    4. **Daily Quote** 📜
    - The bot will send a quote every day if you do your workout. You can get one if you command 'QUOTE ME:' either.
    `;

  // Send the formatted reply
  ctx.replyWithMarkdownV2(escapeMarkdown(replyText));
});

bot.on('message', async (ctx: any) => {
  const msg = ctx.update.message;

  const _userId = await insertUserMessageAndReturnUserId(
    msg.from.username,
    msg.text
  );

  logger.info('Info', { message: 'message', msg });
  // handling privileged users
  if (privilegedUsernames.includes(msg.from.username)) {
    // get users messages
    if (msg.text.includes(getUsersMessagesKeyWord)) {
      const uName = msg.text.split(':')[1];

      if (!uName || uName === '') {
        ctx.reply('No username provided!');
        return;
      }

      const ms = await getUsersMessagesByUsername(uName);
      const prettierMs = ms?.map((item) => item.message).join('\n');

      if (!prettierMs || !prettierMs?.length) {
        ctx.reply('No message found!');
        return;
      }

      ctx.replyWithMarkdownV2(escapeMarkdown(prettierMs));
      return;
    }

    if (msg.text.includes(getPrivilegedUsernamesKeyWord)) {
      // get privileged usernames
      const dp = JSON.stringify(privilegedUsernames);

      ctx.replyWithMarkdownV2(escapeMarkdown(dp));
      return;
    }

    // global messaging
    if (msg.text.includes(globalMessageKeyWord)) {
      await messageAllUsers(msg.text.split(globalMessageKeyWord)[1]);
      return;
    }

    // handle getting reports
    if (msg.text.includes(reportKeyWord)) {
      ctx.reply('preparing ...');
      const uName = msg.text.split(reportKeyWord)[1];

      // get all users reports
      if (!uName || uName === '') {
        const usersReports = await getAllUsersReports();

        const dc = JSON.stringify(usersReports);

        ctx.replyWithMarkdownV2(escapeMarkdown(dc));
        return;
      }

      const data = await getSingleUserReport(uName);

      if (!data) {
        ctx.reply('No such user');
        return;
      }

      let result = '';

      result = data.statuses
        .map((stat) => `${stat.date}: ${stat.info} \n`)
        .join('\n');

      if (!result || !result.length) {
        ctx.reply('No report found');
        return;
      }

      ctx.replyWithMarkdownV2(escapeMarkdown(result));
      return;
    }

    // get all users
    if (msg.text.includes(getAllUsersKeyWord)) {
      const allUsers = await getAllUsers();

      if (!allUsers || !allUsers.length) {
        ctx.reply('No user in DB!');
        return;
      }

      const dp = JSON.stringify(allUsers);

      ctx.replyWithMarkdownV2(escapeMarkdown(dp));
      return;
    }

    // message to
    if (msg.text.includes(messageToKeyWord)) {
      const temp = msg.text.split(':');
      const toUsername = temp[1];
      const message = temp[2];

      if (!toUsername) {
        ctx.reply('No username provided!');
        return;
      }

      if (!message) {
        ctx.reply('No message provided!');
        return;
      }

      try {
        await messageOneUserByUsername(toUsername, message);
        ctx.reply('Sent!');
        return;
      } catch (err) {}
    }

    // has nobat
    if (msg.text.includes('NOBAT')) {
      ctx.reply('Processing ...');
      checkIfHasNobat();
      return;
    }

    /* -------------------------------------------------------------------------- */
    /*                                  settings                                  */
    /* -------------------------------------------------------------------------- */
    // set currency cron
    if (msg.text.includes(setDailyCurrencyCronJobStringKeyWord)) {
      const senderUsername = ctx.from.username;
      const _cron = msg.split(setDailyCurrencyCronJobStringKeyWord)[1];
      const { id } = await getOneUserByUsername(senderUsername);

      if (!validatedUsersRequestedCronString(_cron)) {
        ctx.reply('Please enter a valid cron');
        return;
      }

      await setDailyCurrencyCronString(id as number, _cron);
      ctx.reply('Successfully updated!');
      return;
    }
  }

  // handle workout done
  if (acceptedKeywords.includes(msg.text)) {
    try {
      ctx.reply('Processing ...');
      await updateUsersDailyState(msg.from.username, msg.text);
      const q = await getQuote();
      ctx.reply(
        `🏋️‍♂️ GOOD JOB. YOUR CHANGES ARE SAVED! \n Quote of the day: ${q}`
      );
    } catch (err) {
      logger.error('Daily quote', { message: err });
      ctx.reply('An unexpected error!');
    }
    return;
  }

  // handle quote
  if (msg.text === quoteMeKeyWord) {
    try {
      const q = await getQuote();
      ctx.reply(`Quote: ${q}`);
    } catch (err) {}
    return;
  }

  /* -------------------------------------------------------------------------- */
  /*                                ai generated                                */
  /* -------------------------------------------------------------------------- */
  ctx.reply('Asking ai ...');
  const ms = await getUsersMessagesByUsername(msg.from.username);
  const prettierMs = ms?.map((item) => item.message).join('\n') || 'noMSG';

  logger.info('Ai, user messages', { message: prettierMs });

  const res = await basicPrompt(
    msg,
    msg.from.username,
    JSON.stringify(prettierMs)
  );
  ctx.reply(res);
  return;
});
