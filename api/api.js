"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
var axios_1 = require("axios");
var config_1 = require("../config/config");
exports.api = axios_1.default.create({
    baseURL: config_1.baseURL
});
