"use strict";
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
exports.getAllUsers = exports.updateUsersDailyState = exports.insertUsersDailyInfo = exports.insertUser = void 0;
var pg_1 = require("pg");
var logger_1 = require("../log/logger");
var pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sportreport',
    password: '12345678',
    port: 5432,
});
var insertUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var sameUser, findUser, rows, err_1, query, rows, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sameUser = false;
                findUser = "SELECT * FROM users WHERE username = '".concat(user.username, "'");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.query(findUser)];
            case 2:
                rows = (_a.sent()).rows;
                sameUser = rows.length !== 0;
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1.message);
                return [3 /*break*/, 4];
            case 4:
                if (sameUser) {
                    logger_1.logger.warn('User exists', { message: 'This user already exists on db!' });
                    return [2 /*return*/];
                }
                query = "\n        INSERT INTO users (username, chat_id, is_bot, language_code)\n        VALUES ($1, $2, $3, $4)\n        RETURNING *;\n    ";
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, pool.query(query, [user.username, user.chat_id, user.is_bot, user.language_code])];
            case 6:
                rows = (_a.sent()).rows;
                return [3 /*break*/, 8];
            case 7:
                err_2 = _a.sent();
                logger_1.logger.error('Catch Error', err_2.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.insertUser = insertUser;
var insertUsersDailyInfo = function (user, info) { return __awaiter(void 0, void 0, void 0, function () {
    var date, insertQuery, rows, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                date = new Date().toISOString().split('T')[0];
                insertQuery = "\n        INSERT INTO status (user_id, date, info)\n        VALUES ($1, $2, $3)\n        ON CONFLICT (user_id, date)\n        DO UPDATE SET info = EXCLUDED.info\n        ";
                return [4 /*yield*/, pool.query(insertQuery, [user.id, date, info])];
            case 1:
                rows = (_a.sent()).rows;
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                logger_1.logger.error('Catch Error', { message: err_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.insertUsersDailyInfo = insertUsersDailyInfo;
var updateUsersDailyState = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, getUserQuery, rows, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userData = undefined;
                getUserQuery = "SELECT * FROM users WHERE username = '".concat(username, "'");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.query(getUserQuery)];
            case 2:
                rows = (_a.sent()).rows;
                userData = rows[0];
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                logger_1.logger.error('Catch Error', { message: err_4.message });
                return [3 /*break*/, 4];
            case 4:
                if (!userData) {
                    logger_1.logger.warn('USER NOT FOUND', { message: "requested user not found!" });
                    return [2 /*return*/];
                }
                // insert users info
                return [4 /*yield*/, (0, exports.insertUsersDailyInfo)(userData, 'Done')];
            case 5:
                // insert users info
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateUsersDailyState = updateUsersDailyState;
var getAllUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var getAllQuery, rows, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                getAllQuery = 'SELECT * FROM users';
                return [4 /*yield*/, pool.query(getAllQuery)];
            case 1:
                rows = (_a.sent()).rows;
                if (rows)
                    return [2 /*return*/, rows];
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                logger_1.logger.error('Catch Error', err_5.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
