

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)


export const schemaTypeToTSType = (param: any) => {
    if (param.type) {
        const swaggerType = param.type;
        switch (swaggerType) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'object':
            case 'array':
                return swaggerType
            case 'integer':
                return 'number'
            default:
                throw new Error("Undefined type");
        }
    }  
    const schemaName = param.schema['$ref'].split("/")
    return `definitions['${schemaName[schemaName.length - 1]}']`
};


export const getNameOfRoute = (route: string, suffix="") => {
    const routeSegments = route.split("/")
    const lastElem = routeSegments[routeSegments.length - 1]
    return lastElem.match(new RegExp('{\\w+}')) ? routeSegments[routeSegments.length - 2] + suffix : lastElem
}
