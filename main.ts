import { exception } from 'console';
import { readFileSync, writeFileSync } from 'fs';
import { OpenAPI2 } from './types';



const isRequired = (required: boolean) => {
    return required ? "" : "?"
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const schema = JSON.parse(readFileSync("C:/Users/sapfi/Documents/projects/swaggerGenerator/cloudswagger.json", 'utf-8')) as OpenAPI2

const getNameOfRoute = (route: string) => {
    const routeSegments = route.split("/")
    const lastElem = routeSegments[routeSegments.length - 1]
    return lastElem.match(new RegExp('{\\w+}')) ? routeSegments[routeSegments.length - 2] : lastElem
}

type Method = 'post' | 'delete' | 'put' | 'get';


const outputString = ""
const arr = []

for (const [route, endpointDescription] of Object.entries(schema.paths)) {

    const interactionService = `export class ApiInteractionService {
        constructor(@inject(SERVICE_IDENTIFIER.ApiInteractionService) protected _apiService: IApiInteractionService) {}
    
    `
    
    console.log(getNameOfRoute(route));

    const methods = []
    for (const [method, endpoint] of Object.entries(endpointDescription)) {
        console.log(endpoint);
        
                
        methods.push(`public ${method}${capitalize(getNameOfRoute(route))} = () => {

        }`)
    }

    // console.log(methods);
    
}