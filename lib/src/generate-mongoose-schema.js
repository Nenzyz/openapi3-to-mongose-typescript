"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require('js-yaml');
// const fs   = require('fs');
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const moment_1 = __importDefault(require("moment"));
const functions_1 = require("../util/functions");
// Get document, or throw exception on error
const commomDirModel = './models/';
const commomDirApi = './api/';
const mongooseFieldPattern = {
    type: String,
    index: false,
    unique: false,
    sparse: null,
    required: false,
    default: null,
    lowercase: null,
    uppercase: null,
    match: null,
    minlength: null,
    maxlength: null,
    min: null,
    max: null,
    trim: null,
    validate: null,
    get: null,
    set: null,
    // select: 1,
    enum: null,
};
class GenerateSchema {
    constructor(filenameOrYAML) {
        try {
            if (fs.existsSync(filenameOrYAML)) {
                this._yaml = fs.readFileSync(filenameOrYAML, 'utf8');
            }
            else {
                this._yaml = filenameOrYAML;
            }
            this._yamlParsed = yaml.safeLoad(this._yaml);
        }
        catch (e) {
            throw new Error('Error on read or parse yaml. Error: ' + e);
        }
    }
    generateMongooseSchema(oDir = commomDirModel) {
        /** Create models folder, backup current folder */
        let outputDir = path.resolve(oDir);
        outputDir = path.resolve(outputDir);
        let stats;
        try {
            stats = fs.lstatSync(outputDir);
            if (outputDir.slice(-1) !== '/')
                outputDir = outputDir + '/';
            if (stats.isDirectory()) {
                fs.renameSync(outputDir, outputDir.slice(0, -1) + '-' + (moment_1.default().format().replace(/[:]/gmi, '.')) + '/');
                fs.mkdirpSync(outputDir);
            }
        }
        catch (error) {
            fs.mkdirpSync(outputDir);
            if (outputDir.slice(-1) !== '/')
                outputDir = outputDir + '/';
            stats = fs.lstatSync(outputDir);
        }
        if (outputDir.slice(-1) !== '/')
            outputDir = outputDir + '/';
        let __arraySchemas = [];
        let __arrayFiles = [];
        const schemas = this._yamlParsed.components.schemas;
        try {
            Object.keys(schemas).forEach(k => {
                let __definition = '';
                const nomeSchema = functions_1.capitalizeInalterate(k);
                __arraySchemas.push(nomeSchema);
                const fileName = nomeSchema + '.model.ts';
                __arrayFiles.push(fileName);
                __definition += this.generateMongooseSchemaDefinition(schemas[k], k);
                __definition = `
'use strict';
import { mongoose } from './index';

 ${__definition}               

export const  ${nomeSchema}Model = mongoose.model('${nomeSchema}', ${nomeSchema}MongooseSchema)
`;
                fs.writeFileSync(outputDir + fileName, __definition);
            });
            /**
             * Check custom options on yaml file
             */
            const optionMongoose = this._yamlParsed['x-mongose-server'];
            let defaultMongoDatabase = process.env['MONGO_DEFAULT_DATABASE'] || 'database_default';
            let defaultMongoUrl = process.env['MONGO_URL_CONNECT_SERVER'] || 'mongodb://localhost:27017';
            if (optionMongoose) {
                if (optionMongoose['defaultMongoDatabase']) {
                    if (optionMongoose['defaultMongoDatabase'].slice(0, 1) === '$') {
                        defaultMongoDatabase = process.env[optionMongoose['defaultMongoDatabase'].slice(0)] || defaultMongoDatabase;
                    }
                    else
                        defaultMongoDatabase = optionMongoose['defaultMongoDatabase'];
                }
                if (optionMongoose['connectionString']) {
                    if (optionMongoose['connectionString'].slice(0, 1) === '$') {
                        defaultMongoUrl = process.env[optionMongoose['connectionString'].slice(0)] || defaultMongoUrl;
                    }
                    else
                        defaultMongoDatabase = optionMongoose['defaultMongoDatabase'];
                }
            }
            /**************************************************************************************************************************
             * Generate index.ts with options or enviroment
             */
            let tablesList = __arraySchemas.reduce((sum, i) => sum += `import { ${i}Model }  from './${i}.model'; \n`, '');
            let importList = __arraySchemas.reduce((sum, i) => sum += `${i}Model,`, '').slice(0, -1);
            let generateMongooseDb = `

import mongoose, { Document, Schema, Model, model} from 'mongoose';
var os = require('os');

const colectionDefault = '${defaultMongoDatabase}';
let mongoUrl = \`${defaultMongoUrl}/\${colectionDefault}\`;

mongoose.connect(mongoUrl, function(err) {
    if (err) return console.log(err);
    console.log('Mongoose Connected ' + mongoUrl);
});

${tablesList}

export const mongooseDb = mongoose;
export { mongoose, Document, Schema, Model, model, ${importList}};

`;
            while (/([^;])\n\n/gmi.test(generateMongooseDb))
                generateMongooseDb = generateMongooseDb.replace(/([^;])\n\n/gmi, '$1\n');
            fs.writeFileSync(outputDir + 'index.ts', generateMongooseDb);
        }
        catch (e) {
            console.log(e);
        }
    }
    generateMongooseSchemaDefinition(field, name, prefix = '', nivel = 0) {
        let __preSchemaDefinition = '';
        let __schemaDefinition = '';
        let __postSchemaDefinition = '';
        if (field.type.toLowerCase() === 'object') {
            __schemaDefinition = 'export const ' + functions_1.capitalizeInalterate(prefix) + (prefix === '' ? '' : '_') + functions_1.capitalizeInalterate(name) + 'MongooseSchema = new mongoose.Schema({\n';
            let prop = field.properties;
            Object.keys(prop).forEach(k => {
                let __schemaDefinitionObj = {};
                __schemaDefinitionObj[k] = Object.assign({}, mongooseFieldPattern);
                /** checking moongose type correspondent */
                const __tipoOriginal = prop[k].hasOwnProperty('type') ? prop[k].type.toLowerCase() : '';
                __schemaDefinitionObj[k].type = this.getType(prop[k], k);
                if (__schemaDefinitionObj[k].type == 'object') {
                    __postSchemaDefinition += this.generateMongooseSchemaDefinition(prop[k], k, name, nivel + 1);
                    __schemaDefinitionObj[k] = functions_1.capitalizeInalterate(name) + '_' + functions_1.capitalizeInalterate(k) + 'MongooseSchema,';
                }
                else {
                    if (__schemaDefinitionObj[k].type === 'String')
                        __schemaDefinitionObj[k].trim = true;
                }
                if (prop[k].hasOwnProperty('default'))
                    __schemaDefinitionObj[k].default = prop[k].default;
                if (prop[k].hasOwnProperty('pattern'))
                    __schemaDefinitionObj[k].match = prop[k].pattern;
                if (prop[k].hasOwnProperty('enum'))
                    __schemaDefinitionObj[k].enum = prop[k].enum;
                /**
                 * Verify custom directive x-mongoose with custom setting for mongosse field
                 * check in https://swagger.io/docs/specification/openapi-extensions/
                 */
                if (prop[k].hasOwnProperty('x-mongose')) {
                    const __modifiersMongoose = prop[k]['x-mongose'];
                    Object.keys(__modifiersMongoose).forEach(m => {
                        __schemaDefinitionObj[k][m] = __modifiersMongoose[m];
                    });
                }
                /** delete properties with no values */
                Object.keys(__schemaDefinitionObj[k]).forEach(j => {
                    if (__schemaDefinitionObj[k][j] === null) {
                        delete __schemaDefinitionObj[k][j];
                    }
                });
                /** cheking inherancet */
                if (prop[k].hasOwnProperty('$ref')) {
                    const __modName = prop[k]['$ref'].replace(/^(.*)\//gmi, '');
                    __schemaDefinition += `    "${k}" :  ${__modName}MongooseSchema,`;
                    __preSchemaDefinition += `import { ${__modName}MongooseSchema } from './${__modName}.model';`;
                }
                else {
                    if (__tipoOriginal == 'array') {
                        __schemaDefinition += '    ' + JSON.stringify(__schemaDefinitionObj)
                            .replace(/[:]/i, ': [')
                            .replace(/^\{/i, '')
                            .replace(/\}$/i, '')
                            + ' ],\n';
                    }
                    else {
                        __schemaDefinition += '    ' +
                            JSON.stringify(__schemaDefinitionObj)
                                .replace(/^\{/i, '')
                                .replace(/\}$/i, '')
                            + ',\n';
                    }
                }
            });
            /** terminate mongoose schema */
            __schemaDefinition += '\n}, ' + (nivel === 0 ? '{_id: true}' : '{_id: false}') + ' );';
            __schemaDefinition = __preSchemaDefinition + '\n\n' + __postSchemaDefinition + '\n\n' + __schemaDefinition;
            __schemaDefinition = __schemaDefinition.replace(/["][:]["](.*?)[,]["][,]$/gmi, '": $1,');
            __schemaDefinition = __schemaDefinition.replace(/["]type["][:]["](.*?)["]/gmi, '"type":$1');
            /** remove extra blank lines */
            while (/[^;]\n\n/gmi.test(__schemaDefinition))
                __schemaDefinition = __schemaDefinition.replace(/[^;]\n\n/gmi, '\n');
            return __schemaDefinition;
        }
    }
    getType(field, name) {
        if (field.type) {
            if (name === 'id' || name === '_id') {
                return 'Schema.Types.ObjectId';
            }
            else {
                switch (field.type.toLowerCase()) {
                    case 'number':
                    case 'integer':
                        return 'Number';
                    case 'string':
                        if (field.format) {
                            switch (field.type.toLowerCase()) {
                                case 'date':
                                case 'date-time':
                                    return 'Date';
                                default:
                                    return 'String';
                            }
                        }
                        return 'String';
                    case 'array':
                        return this.getType(field.items, name);
                    case 'object':
                        return 'object';
                }
            }
        }
    }
}
exports.GenerateSchema = GenerateSchema;
//# sourceMappingURL=generate-mongoose-schema.js.map