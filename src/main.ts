import { readFileSync, writeFileSync } from 'fs';
import prettier from "prettier"
import SwaggerToTS, {OpenAPI2} from 'openapi-typescript'
import { generateClasses } from './swaggerParser';

const optionDefinitions = [
    { name: 'SwaggerJsonPath', type: String},
    { name: 'IApiPath', type: String },
    { name: 'ServiceIdPath', type: String }
  ]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)
const {SwaggerJsonPath, IApiPath, ServiceIdPath} = options;

const schema = JSON.parse(readFileSync(SwaggerJsonPath, 'utf-8')) as OpenAPI2


writeFileSync("./data/operations.ts", SwaggerToTS(schema))

const prettierParams = { semi: true, parser: "typescript" }
const formatted = prettier.format(
    generateClasses(
        schema, 
        {
            IApiInteractionServiceDirectory: IApiPath, 
            ServiceIdentifierDirectory: ServiceIdPath
        }
    ), 
    prettierParams);
writeFileSync("./data/filename.ts", formatted)
