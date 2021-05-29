import { exception } from 'console';
import { readFileSync, writeFileSync } from 'fs';



const getTSType = (swaggerType: string) => {
    switch (swaggerType) {
        case 'string':
        case 'number':
            return swaggerType
        case 'boolean':
            return 'bool'
        case 'integer':
            return 'number'
        case 'object':
        case 'array':
            throw new Error()
        default:
            break;
    }
};

type End = {
    responses: {
        [index: string]: any
    }
    operationId: string
    tags: any[]
}

type Definitions = {
    [index: string] : {
        properties: any,
        required?: string[],
        type: string
    }
    
}

type Swagger = {paths: {[index: string] : {[key in Method]: End}}, definitions: Definitions}

const swaggerJson = readFileSync("C:/Users/sapfi/Documents/projects/swaggerGenerator/cloudswagger.json", 'utf-8') as unknown as Swagger


type Method = 'post' | 'delete' | 'put' | 'get';

type Endpoint<Response, Error> = {
    path: string;
    response: Response;
    error: Error;
    params: any;
};

type EndpointDescription = Map<Method, Endpoint<any, any>>;

const endpoints = new Map<string, EndpointDescription>();

const types = new Map<string, any>();
console.log(swaggerJson);

for (const [title, definition] of Object.entries(swaggerJson.definitions)) {
    const props = []
    for (const [propName, propDesc] of Object.entries(definition)) {
        const isRequired = definition.required.includes(propName)
        props.push(`${propName} ${getTSType(propDesc.type)}`)
    }
    types.set(title, props)
}

console.log(types);


for (const path in swaggerJson.paths) {
    const endpointDesc: EndpointDescription = new Map();
    const endpointPath = swaggerJson.paths[path];

    for (const method in endpointPath) {
        const endpoint = endpointPath[method];
        // console.log(method);
        const params = endpoint.parameters.map((param) => `${param.name}${param.required ? "" : "?"}: ${getTSType(param.type)}`)
        
        // for (const statusCode in endpoint.responses) {
        //     console.log(endpoint.responses[statusCode]);
        // }


        
        // endpointDesc.set(method, {params: params})
        
    }

    endpoints.set(path, endpointDesc);
}
