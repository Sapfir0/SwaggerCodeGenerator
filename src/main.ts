import { readFileSync, writeFileSync } from 'fs';
import { ClassBuilder } from './ClassBuilder';
import {capitalize, getNameOfRoute, schemaTypeToTSType} from "./utils"
import { OpenAPI2 } from './types';
import prettier from "prettier"

const schema = JSON.parse(readFileSync("C:/Users/sapfi/Documents/projects/swaggerGenerator/cloudswagger.json", 'utf-8')) as OpenAPI2


const imports = `import {inject} from 'inversify'\n
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
let outputString = imports + routesBlock + interactionServices.join('} \n') 


const formatted = prettier.format(outputString, { semi: true, parser: "babel" });

writeFileSync("./filename.ts", formatted)