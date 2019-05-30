#!/usr/bin/env node
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
    .option(['h', '?', 'help'], 'Show this help', false)
    .examples([
    { usage: 'openapi3-to-mongose-typescript -h', description: 'show this helps' },
    { usage: 'openapi3-to-mongose-typescript -i server/api', description: 'read yaml files with OpenAPI 3 Specification in folder "server/api/" and generate typescript files in "models/" on current directory' },
    { usage: 'openapi3-to-mongose-typescript -o database/models', description: 'read yaml files with Swagger Specification in folder "api/" and generate typescript files in "database/models/" on current directory' },
    { usage: 'openapi3-to-mongose-typescript -i docs/api -o db/models', description: 'read yaml files with OpenAPI 3 Specification in folder "docs/api/" and generate typescript files in "db/models/" on current directory' },
]);
const config = args_1.default.parse(process.argv, {
    name: 'openapi3-to-mongose-typescript',
    version: true,
    value: ''
});
if (config.help) {
    args_1.default.showHelp();
    args_1.default.showVersion();
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