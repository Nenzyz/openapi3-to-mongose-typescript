"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_mongoose_schema_1 = require("./generate-mongoose-schema");
let ob = new generate_mongoose_schema_1.GenerateSchema('./server/common/api.yml');
// let ob2 = new GenerateSchema('./util/exemplos-api/haniot.yaml');
// let ob3 = new GenerateSchema('./util/exemplos-api/vision360.yaml');
// let ob4 = new GenerateSchema('./util/exemplos-api/whs-standar.yml');
ob.generateMongooseSchema();
//# sourceMappingURL=teste.gen.js.map