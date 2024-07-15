"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
var telegraf_1 = require("telegraf");
var logger_1 = require("../log/logger");
var helpers_1 = require("../utils/helpers");
var config_1 = require("../config/config");
var db_1 = require("../db/db");
if (!config_1.api_token)
    logger_1.logger.error('NO Api Token', { message: 'no api token!' });
exports.bot = new telegraf_1.Telegraf(config_1.api_token);
exports.bot.start(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, db_1.insertUser)(__assign({}, ctx.update.message.from))];
            case 1:
                _a.sent();
                logger_1.logger.info('Bot start', { username: ctx.update.message.from.username });
                ctx.reply('Hi! Welcome.');
                return [2 /*return*/];
        }
    });
}); });
exports.bot.help(function (ctx) {
    var replyText = "\n    \uD83C\uDF1F *Daily Workout Bot Features* \uD83C\uDF1F\n\n    1. **Completion Detection** \uD83C\uDFC6\n    - When the bot receives a message containing any of the following phrases: \"DONE\", \"COMPLETE\", \"I'VE DONE MY WORKOUT\", or \"TODAY IS DONE\", it will mark your daily workout as completed.\n\n    2. **Daily Reminder** \u23F0\n    - The bot will send you a friendly reminder every day at 17:00 to keep you on track with your fitness goals.\n\n    3. **Coach Privileges** \uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F\n    - If you are a coach (a user with full access to the bot), you can use the following keywords for additional functionalities:\n        - **\"GLOBAL MESSAGE:\"** \uD83C\uDF10: Use this keyword in your message to notify all members.\n        - **\"GET REPORT\"** \uD83D\uDCCA: Use this keyword to view users' daily statuses.\n    ";
    // Send the formatted reply
    ctx.replyWithMarkdownV2((0, helpers_1.escapeMarkdown)(replyText));
});
exports.bot.on('message', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, dp, uName, usersReports, dc_1, data, dc, allUsers, dp, q, err_1, q, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msg = ctx.update.message;
                if (!config_1.privilegedUsernames.includes(msg.from.username)) return [3 /*break*/, 8];
                // get privileged usernames
                if (msg.text.includes(config_1.getPrivilegedUsernamesKeyWord)) {
                    dp = JSON.stringify(config_1.privilegedUsernames);
                    ctx.replyWithMarkdownV2((0, helpers_1.escapeMarkdown)(dp));
                    return [2 /*return*/];
                }
                if (!msg.text.includes(config_1.globalMessageKeyWord)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, helpers_1.messageAllUsers)(msg.text.split(config_1.globalMessageKeyWord)[1])];
            case 1:
                _a.sent();
                return [2 /*return*/];
            case 2:
                if (!msg.text.includes(config_1.reportKeyWord)) return [3 /*break*/, 6];
                ctx.reply('preparing ...');
                uName = msg.text.split(config_1.reportKeyWord)[1];
                if (!(!uName || uName === '')) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, db_1.getAllUsersReports)()];
            case 3:
                usersReports = _a.sent();
                dc_1 = JSON.stringify(usersReports);
                ctx.replyWithMarkdownV2((0, helpers_1.escapeMarkdown)(dc_1));
                return [2 /*return*/];
            case 4: return [4 /*yield*/, (0, db_1.getSingleUserReport)(uName)];
            case 5:
                data = _a.sent();
                if (!data) {
                    ctx.reply('No such user');
                    return [2 /*return*/];
                }
                dc = JSON.stringify(data);
                ctx.replyWithMarkdownV2((0, helpers_1.escapeMarkdown)(dc));
                return [2 /*return*/];
            case 6:
                if (!msg.text.includes(config_1.getAllUsersKeyWord)) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, db_1.getAllUsers)()];
            case 7:
                allUsers = _a.sent();
                if (!allUsers || !allUsers.length) {
                    ctx.reply('No user in DB!');
                    return [2 /*return*/];
                }
                dp = JSON.stringify(allUsers);
                ctx.replyWithMarkdownV2((0, helpers_1.escapeMarkdown)(dp));
                return [2 /*return*/];
            case 8:
                if (!config_1.acceptedKeywords.includes(msg.text)) return [3 /*break*/, 14];
                _a.label = 9;
            case 9:
                _a.trys.push([9, 12, , 13]);
                ctx.reply('Processing ...');
                return [4 /*yield*/, (0, db_1.updateUsersDailyState)(msg.from.username, msg.text)];
            case 10:
                _a.sent();
                return [4 /*yield*/, (0, helpers_1.getQuote)()];
            case 11:
                q = _a.sent();
                ctx.reply("\uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F GOOD JOB. YOUR CHANGES ARE SAVED! \n Quote of the day: ".concat(q));
                return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                logger_1.logger.error('Daily quote', { message: err_1 });
                ctx.reply('An unexpected error!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
            case 14:
                if (!(msg.text === config_1.quoteMeKeyWord)) return [3 /*break*/, 19];
                _a.label = 15;
            case 15:
                _a.trys.push([15, 17, , 18]);
                return [4 /*yield*/, (0, helpers_1.getQuote)()];
            case 16:
                q = _a.sent();
                ctx.reply("Quote: ".concat(q));
                return [3 /*break*/, 18];
            case 17:
                err_2 = _a.sent();
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
            case 19:
                // if nothing, reply
                ctx.reply("THIS IS NO COMMAND!");
                return [2 /*return*/];
        }
    });
}); });
