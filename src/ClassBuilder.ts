
type AccessModifier = 'public' | 'private' | 'protected'

export class ClassBuilder {
    private newClass: string = ""
    constructor(className: string, newCtor?: string) {
        this.newClass = `export class ${className} {`
        if (newCtor) {
            this.addConstructor(newCtor)
        }
    }

    public addConstructor = (args: string) => {
        this.newClass += `\n constructor(${args}) { }\n`
    }

    public addMethod = (accessModifier: AccessModifier, name: string, args: string, body: string) => {
       this.newClass += `${accessModifier} ${name} = (${args}) => {
            ${body}
       } \n`
    }

    public addPublicMethod = (name: string, args: string, body: string) => this.addMethod('public', name, args, body)
    public addPrivateMethod = (name: string, args: string, body: string) => this.addMethod('private', name, args, body)
    public addProtectedMethod = (name: string, args: string, body: string) => this.addMethod('protected', name, args, body)

    public getClass = () => {
        return this.newClass + "}\n"
    } 
}