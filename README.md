# OpenApi 3.0 to Mongoose Typescript
Create Mongoose Schemas and Connection objects from [OpenAPI 3.0 Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) yaml files in a folder. Suggestions, fork and collaborations are welcome on my [gitlab](https://gitlab.com/fran.fig/openapi3-to-mongose-typescript)

## Install
```bash
$ npm install -g openapi3-to-mongose-typescript
```

## Models Generate

The package read yaml file and generate:
* one file with object json schema for all high level #/component/schema
* one file **index.ts** with connection to mongoose and exported all high level schema model
* 
For developer security, the destination folder of the typescript files, if any, will be moved to a folder of the same name with a timestamp of when it was made. **Don't forget to commit any changes to your git repo before running these command**

## Example of Schemas generate by package for the file [api.yml](#example-yaml--apiyml-) above 

### SystemOptions.model.ts
```typescript
'use strict';
import { mongoose } from './index';

 import { AddressMongooseSchema } from './Address.model';

export const ConnectRocketChatOptions_UserServiceMongooseSchema = new mongoose.Schema({
    "name":{"type":String,"index":false,"unique":false,"required":false,"match":"^[A-Za-z0-9]+$","trim":true},
    "password":{"type":String,"index":false,"unique":false,"required":false,"trim":true}
}, {_id: false} );

export const SystemOptions_ConnectRocketChatOptionsMongooseSchema = new mongoose.Schema({
    "userService": ConnectRocketChatOptions_UserServiceMongooseSchema
}, {_id: false} );

export const SystemOptionsMongooseSchema = new mongoose.Schema({
    "timeLimitWaitMinutes":{"type":Number,"index":false,"unique":false,"required":false,"default":60},
    "initTimeHour":{"type":Number,"index":false,"unique":false,"required":false,"default":9},
    "finishTimeHour":{"type":Number,"index":false,"unique":false,"required":false},
    "cutHour":{"type":Number,"index":false,"unique":false,"required":false},
    "connectRocketChatOptions": SystemOptions_ConnectRocketChatOptionsMongooseSchema,
    "serverType":{"type":String,"index":false,"unique":false,"required":false,"default":"corporativo","trim":true,"enum":["corporativo","departamental","testes","homologação"]},
    "nomeChefe":{"type":String,"index":true,"unique":false,"required":false,"uppercase":true,"match":"^\\d.*?$","trim":true},
    "addressCompany" :  AddressMongooseSchema,
}, {_id: true} );               

export const  SystemOptionsModel = mongoose.model('SystemOptions', SystemOptionsMongooseSchema)
```

### Address.model.ts
```typescript
'use strict';
import { mongoose } from './index';

 

export const Address_LocationMongooseSchema = new mongoose.Schema({
    "type":{"type":String,"index":false,"unique":false,"required":false,"trim":true},
    "coordinates": [{"type":Number,"index":false,"unique":false,"required":false} ]
}, {_id: false} );

export const AddressMongooseSchema = new mongoose.Schema({
    "logradouro":{"type":String,"index":false,"unique":false,"required":false,"trim":true},
    "numero":{"type":String,"index":false,"unique":false,"required":false,"trim":true},
    "complemento":{"type":String,"index":false,"unique":false,"required":false,"trim":true},
    "bairro":{"type":String,"index":false,"unique":false,"required":false,"trim":true},
    "cidade":{"type":String,"index":true,"unique":false,"required":false,"uppercase":false,"trim":true},
    "uf":{"type":String,"index":true,"unique":false,"required":false,"uppercase":true,"trim":true},
    "cep":{"type":Number,"index":true,"unique":false,"required":false},
    "location": Address_LocationMongooseSchema
}, {_id: true} );               

export const  AddressModel = mongoose.model('Address', AddressMongooseSchema)
```

### index.ts
```typescript
import mongoose, { Document, Schema, Model, model} from 'mongoose';

const colectionDefault = 'database_default';
let mongoUrl = `mongodb://localhost:27017/${colectionDefault}`;

mongoose.connect(mongoUrl, function(err) {
    if (err) return console.log(err);
    console.log('Mongoose Connected ' + mongoUrl);
});

import { AddressModel }  from './Address.model'; 
import { SystemOptionsModel }  from './SystemOptions.model'; 
export const mongooseDb = mongoose;
export { mongoose, Document, Schema, Model, model, AddressModel,SystemOptionsModel};

```


## Usage
```bash
Usage: openapi3-to-mongose-typescript [options] [command]

  Commands:
    help     Display help
    version  Display version

  Options:
    -h, --?               Show this help (disabled by default)
    -H, --help            Output usage information
    -i, --input [value]   Folder when are the yaml open3 api description (defaults to "api/")
    -n, --no-backup       Don't backup older versions of moongose models
    -o, --output [value]  Folder when write the mogoose models. the program backup older versions for default (defaults to "models/")
    -v, --version         Output the version number

  Examples:
    - show this helps
    $ openapi3-to-mongose-typescript -h

    - read yaml files with OpenAPI 3 Specification in folder "server/api/" and generate typescript files in "models/" on current directory
    $ openapi3-to-mongose-typescript -i server/api

    - read yaml files with Swagger Specification in folder "api/" and generate typescript files in "database/models/" on current directory
    $ openapi3-to-mongose-typescript -o database/models

    - read yaml files with OpenAPI 3 Specification in folder "docs/api/" and generate typescript files in "db/models/" on current directory
    $ openapi3-to-mongose-typescript -i docs/api -o db/models
```
## OpenAPI 3
OpenAPI Specification (formerly Swagger Specification) is an API description format for REST APIs. An OpenAPI file allows you to describe your entire API, including:

* Available endpoints (/users) and operations on each endpoint (GET /users, POST /users)
* Operation parameters Input and output for each operation
* Authentication methods
* Contact information, license, terms of use and other information.
  
API specifications can be written in YAML or JSON. The format is easy to learn and readable to both humans and machines. The complete OpenAPI Specification can be found on GitHub: [OpenAPI 3.0 Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md)

See the [Swagger Docs](https://swagger.io/docs/specification/about/)

## Extra x-mongose commands
The package suport, for each field, extra x-mongose settings, in 2 groups:
### server commands
#### Example

```yaml
components:
  x-mongose-server:
    defaultDatabase: GerenciamentoChatCAIXA
    connectionString: $MONGO_URL_CONNECT_SERVER #Enviroment variable
```

### fields settings
Change the fields settings conform [SchemaType Options](https://mongoosejs.com/docs/schematypes.html#schematype-options)
#### Example
```yaml

        fieldName:
          type: string                      #field tipe
          x-mongose: 
            trim: true
            uppercase: true
            index: true
```

## Example yaml (  [api.yml](https://gitlab.com/fran.fig/openapi3-to-mongose-typescript/raw/master/api/api.yml)  )

This is a typical  [OpenAPI 3.0 Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md), we recomend the [Swagger OpenSource Tools](https://swagger.io/tools/open-source/) or [SwaggerHub](https://swagger.io/tools/swaggerhub/)

```yaml
openapi: 3.0.0
# Added by API Auto Mocking Plugin
servers:
  - description: API Server of LiveChat Manager
    url: https://chat.governamental.com.br/api/v1
# Added by API Auto Mocking Plugin
  - description: SwaggerHub API Auto Mocking
    url: https://virtserver.swaggerhub.com/fran-fig/RocketChatManager/1.0.0
info:
  version: "0.1.0"
  title: Sistema de geração de dados de gerenciamento do LiveChat da CAIXA
  description: >-
    Sistema de geração de dados de qualidade para o LiveChat da Caixa Economica

tags:
  - name: attendants
    description: Consolidação de dados do atendente / attendants data consolidation
  - name: system
    description: system data and options


security:
  - implicit:
      - read
      - write

components:
  x-mongose-server:
    defaultDatabase: GerenciamentoChatCAIXA
    connectionString: $MONGO_URL_CONNECT_SERVER #Enviroment variable
    
  schemas: 
    Address:
      type: object
      properties:
        logradouro:
          type: string
          example: Setor Comercial Sul, Quadra 2, Bloco B, Lote 20 Sala 
        numero:
          type: string
          example: 706
        complemento:
          type: string
          example: Ed. Palácio do Comércio
        bairro:
          type: string
          example: Asa Sul
        cidade:
          type: string
          example: Brasília
          x-mongose: 
            trim: true
            uppercase: false
            index: true
        uf:
          type: string
          example: DF
          x-mongose: 
            trim: true
            uppercase: true
            index: true
        cep:
          type: number
          format: int
          example: 70318900
          x-mongose: 
            index: true
        location:
          type: object
          properties:
            type: 
              type: string
              example: Point
            coordinates: 
              type: array
              items: 
                type: number
                example: 
                  - -73.856077
                  - 40.848447

    SystemOptions:
      type: object
      properties:
        timeLimitWaitMinutes:
          type: integer
          format: int
          description: Timeout for client expect a response attendant / Tempo limite para o cliente esperar uma resposta do atendente 
          default: 60
          example: 60
          minimum: 1
          maximum: 1200
        initTimeHour:
          type: integer
          format: int
          description: Customer service starts at 9am / Atendimento inicia as 9h
          default: 9
          example: 9
          minimum: 0
          maximum: 24
        finishTimeHour:
          type: integer
          format: int
          description: Customer service ends at 6pm / Atendimento termina às 18h
          minimum: 0
          maximum: 24
        cutHour:
          type: integer
          format: int
          description: Customer service ends at 6pm / Atendimento termina às 18h
          minimum: 0
          maximum: 24
        connectRocketChatOptions:
            type: object
            properties:
              userService:
                type: object
                properties:
                  name:
                    type: string
                    format: username
                    pattern: ^[A-Za-z0-9]+$
                    description: Rocket chat user service name / Nome do usuário de serviço do rocket chat
                  password:
                    type: string
                    format: username
                required:
                  - name
                  - password
        serverType:
          type: string
          default: corporativo
          description: Rocket chat type user
          enum:
            - corporativo
            - departamental
            - testes
            - homologação
        nomeChefe:
          type: string
          description: Rocket chat test
          pattern: '^\d.*?$'
          x-mongose: 
            trim: true
            uppercase: true
            index: true
        addressCompany:
            $ref: '#/components/schemas/Address'
          
        
  securitySchemes:
    implicit:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: 'http://example.com/oauth/auth'
          scopes:
            write: allows modifying resources
            read: allows reading resources      
      
paths:
  /options:
    get:
      tags: 
        - system
      summary: Get options settings from server
      description: Get settings from server to client
      responses:
        '200':
          description: OK
          
  /ping:
    get:
      summary: Server heartbeat operation
      description: >-
        This operation shows how to override the global security defined above,
        as we want to open it up for all users.
      security: []
      responses:
        '200':
          description: OK
```
