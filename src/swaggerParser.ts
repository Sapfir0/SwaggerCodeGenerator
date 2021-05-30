import { ClassBuilder } from "./ClassBuilder"
import { capitalize, getNameOfRoute, joinArrayToString, schemaTypeToTSType } from "./utils"
import {OpenAPI2} from 'openapi-typescript'

type TransformParams = {
    IApiInteractionServiceDirectory: string
    ServiceIdentifierDirectory: string
}


export const generateClasses = (schema: OpenAPI2, params: TransformParams) => {
    const {IApiInteractionServiceDirectory, ServiceIdentifierDirectory} = params

    const imports = `import {inject} from 'inversify';
    import {operations, definitions} from './operations';
    import { IApiInteractionService } from '${IApiInteractionServiceDirectory}';
    import { SERVICE_IDENTIFIER } from '${ServiceIdentifierDirectory}';`

    const routesList = []
    const interactionServices = []
    
    for (const [route, endpointDescription] of Object.entries(schema.paths!)) {
    
        const capitalizedRouteName = capitalize(getNameOfRoute(route))
        const routeWithId = capitalize(getNameOfRoute(route, "Id"))
        const interactionService = new ClassBuilder(`${routeWithId}ApiInteractionService`,  `@inject(SERVICE_IDENTIFIER.ApiInteractionService) protected apiService: IApiInteractionService`)
       
        routesList.push(`${routeWithId}: '${route}',`)
        for (const [method, endpoint] of Object.entries(endpointDescription)) {
            const typedParams = endpoint.parameters.map((param: any) => `${param.name}: ${schemaTypeToTSType(param)}`)
            const params = endpoint.parameters.map((param: any) => param.name)
            interactionService.addPublicMethod(`${method}${capitalizedRouteName}`, joinArrayToString(typedParams), `return this.apiService.${method}(API_ROUTES.${routeWithId}, ${joinArrayToString(params)})`)
    
        }
    
        interactionServices.push(interactionService.getClass())
    }
    
    const routesBlock = `const API_ROUTES = {\n ${routesList.join("\n")} }\n`
    return imports + routesBlock + interactionServices.join('\n') 
}
