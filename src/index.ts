#!/usr/bin/env node

import args from 'args';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from  'glob';
import { GenerateSchema } from './generate-mongoose-schema';

args
    .option(['i','input','input-folder','input-folder-yaml'], 'Folder when are the yaml open3 api description','api/')
    .option(['o','output','output-folder','output-folder-models'], 'Folder when write the mogoose models. the program backup older versions for default','models/')
    .option(['n','no-backup'], 'Don\'t backup older versions of moongose models')
    .option(['h','?','help'], 'Show this help',false)
    .examples([
        { usage: 'openapi3-to-mongose-typescript -h', description: 'show this helps' },
        { usage: 'openapi3-to-mongose-typescript -i server/api', description: 'read yaml files with OpenAPI 3 Specification in folder "server/api/" and generate typescript files in "models/" on current directory' },
        { usage: 'openapi3-to-mongose-typescript -o database/models', description: 'read yaml files with Swagger Specification in folder "api/" and generate typescript files in "database/models/" on current directory' },
        { usage: 'openapi3-to-mongose-typescript -i docs/api -o db/models', description: 'read yaml files with OpenAPI 3 Specification in folder "docs/api/" and generate typescript files in "db/models/" on current directory' },
    ]);


const config = args.parse(process.argv,{
    name: 'openapi3-to-mongose-typescript',
    version: true,
    value: ''
});

if(config.help) {
    args.showHelp();
    args.showVersion();
}

const apiFolder = path.resolve(process.cwd() + '/' + config.input);
const modelFolder = path.resolve(process.cwd() + '/' + config.output);

const filesYAML = glob.sync(`${apiFolder}/*.y*ml`);

filesYAML.forEach(fileYAML => {
    const generateModel = new GenerateSchema(fileYAML);
    const nameFileYAML = path.basename(fileYAML,path.extname(fileYAML));
    const folderOutput = modelFolder + '/' + nameFileYAML
    generateModel.generateMongooseSchema(folderOutput)
    
});

console.log(filesYAML);