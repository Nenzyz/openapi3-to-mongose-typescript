"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = __importDefault(require("args"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const generate_mongoose_schema_1 = require("./generate-mongoose-schema");
args_1.default
    .option(['i', 'input', 'input-folder', 'input-folder-yaml'], 'Folder when are the yaml open3 api description', 'api/')
    .option(['o', 'output', 'output-folder', 'output-folder-models'], 'Folder when write the mogoose models. the program backup older versions for default', 'models/')
    .option(['n', 'no-backup'], 'Don\'t backup older versions of moongose models')
    .option(['h', '?', 'help'], 'Show this help', false);
const config = args_1.default.parse(process.argv);
if (config.help) {
    args_1.default.showHelp();
}
const apiFolder = path.resolve(process.cwd() + '/' + config.input);
const modelFolder = path.resolve(process.cwd() + '/' + config.output);
const filesYAML = glob.sync(`${apiFolder}/*.y*ml`);
filesYAML.forEach(fileYAML => {
    const generateModel = new generate_mongoose_schema_1.GenerateSchema(fileYAML);
    const nameFileYAML = path.basename(fileYAML, path.extname(fileYAML));
    const folderOutput = modelFolder + '/' + nameFileYAML;
    generateModel.generateMongooseSchema(folderOutput);
});
console.log(filesYAML);
//# sourceMappingURL=index.js.map