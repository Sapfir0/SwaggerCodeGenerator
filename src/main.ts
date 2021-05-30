import { readFileSync, writeFileSync } from 'fs';
import { ClassBuilder } from './ClassBuilder';
import {capitalize, getNameOfRoute, schemaTypeToTSType} from "./utils"
import prettier from "prettier"
import SwaggerToTS, {OpenAPI2} from 'openapi-typescript'

const schema = JSON.parse(readFileSync("C:/Users/sapfi/Documents/projects/swaggerGenerator/data/cloudswagger.json", 'utf-8')) as OpenAPI2

const IApiInteractionServiceDirectory = '../../shared/types/ApiTypes'
const ServiceIdentifierDirectory = '../../inversify/inversifyTypes'

const imports = `import {inject} from 'inversify';
import {operations, definitions} from './operations';
import { IApiInteractionService } from '${IApiInteractionServiceDirectory}';
import { SERVICE_IDENTIFIER } from '${ServiceIdentifierDirectory}';
` 

const routesList = []

const interactionServices = []
for (const [route, endpointDescription] of Object.entries(schema.paths!)) {

    const capitalizedRouteName = capitalize(getNameOfRoute(route))
    const routeWithId = capitalize(getNameOfRoute(route, "Id"))
    const interactionService = new ClassBuilder(`${routeWithId}ApiInteractionService`,  `@inject(SERVICE_IDENTIFIER.ApiInteractionService) protected _apiService: IApiInteractionService`)
   
    routesList.push(`${routeWithId}: '${route}',`)
    for (const [method, endpoint] of Object.entries(endpointDescription)) {
        const params = endpoint.parameters.map((param: any) => `${param.name}: ${schemaTypeToTSType(param)}`)

        const paramArgument = params ? `${params.join(", ")}` : "" 
        interactionService.addPublicMethod(`${method}${capitalizedRouteName}`, paramArgument, `return this._apiService.${method}(API_ROUTES.${routeWithId}, {${endpoint.parameters.map((param: any) => param.name)}} )`)

    }

    interactionServices.push(interactionService.getClass())
}

const routesBlock = `const API_ROUTES = {\n ${routesList.join("\n")} }\n`
let outputString = imports + routesBlock + interactionServices.join('\n') 

// writeFileSync("./data/filename.ts", outputString)

const swaggerData = SwaggerToTS(schema)
writeFileSync("./data/operations.ts", swaggerData)
const formatted = prettier.format(outputString, { semi: true, parser: "babel" });

writeFileSync("./data/filename.ts", formatted)