"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = __importDefault(require("args"));
args_1.default
    .option(['i', 'input', 'input-folder', 'input-folder-yaml'], 'Folder when are the yaml open3 api description', './api')
    .option(['o', 'output', 'output-folder', 'output-folder-models'], 'Folder when write the mogoose models. the program backup older versions for default', './models')
    .option(['n', 'no-backup'], 'Don\'t backup older versions of moongose models')
    .option(['h', '?', 'help'], 'Show this help', false);
const config = args_1.default.parse(process.argv);
if (config.help) {
    args_1.default.showHelp();
}
//# sourceMappingURL=index.js.map