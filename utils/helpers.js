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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuote = exports.escapeMarkdown = exports.getMe = exports.messageAllUsers = exports.getUpdates = void 0;
var logger_1 = require("../log/logger");
var api_1 = require("../api/api");
var db_1 = require("../db/db");
var config_1 = require("../config/config");
var getUpdates = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, userIds_1, users, insertPromises, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, api_1.api.get('/getUpdates')];
            case 1:
                data = (_a.sent()).data;
                userIds_1 = [];
                users = data.result.map(function (item) {
                    var from = item.message.from;
                    if (!userIds_1.includes(from.id)) {
                        userIds_1.push(from.id);
                        return __assign(__assign({}, from), { chat_id: from.id });
                    }
                }).filter(function (item) { return item; });
                insertPromises = users.map(function (user) {
                    return (0, db_1.insertUser)(user).catch(function (err) { return logger_1.logger.error('Catch Error', err.message); });
                });
                return [4 /*yield*/, Promise.all(insertPromises)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                logger_1.logger.error('Catch Error', err_1.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUpdates = getUpdates;
var messageAllUsers = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (message) {
        var dbUsers, promises;
        if (message === void 0) { message = 'Global'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.getAllUsers)()];
                case 1:
                    dbUsers = _a.sent();
                    if (!dbUsers || !dbUsers.length) {
                        logger_1.logger.warn('No user in db!', { message: 'There is no user in database to notify!' });
                        return [2 /*return*/];
                    }
                    promises = dbUsers.map(function (user) {
                        return api_1.api.post("/sendMessage?chat_id=".concat(user.chat_id, "&text=").concat(message)).catch(function (err) { return console.log(err); });
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.messageAllUsers = messageAllUsers;
var getMe = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api_1.api.get('getMe')];
            case 1:
                data = (_a.sent()).data;
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                logger_1.logger.error('Catch Error', err_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMe = getMe;
var escapeMarkdown = function (text) {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
};
exports.escapeMarkdown = escapeMarkdown;
var getQuote = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.api.get(config_1.dailyQuoteUrl)];
            case 1: return [2 /*return*/, (_a.sent()).data.quote.body];
        }
    });
}); };
exports.getQuote = getQuote;
