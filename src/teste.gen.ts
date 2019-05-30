import { GenerateSchema } from "./generate-mongoose-schema";



let ob = new GenerateSchema('./server/common/api.yml');
// let ob2 = new GenerateSchema('./util/exemplos-api/haniot.yaml');
// let ob3 = new GenerateSchema('./util/exemplos-api/vision360.yaml');
// let ob4 = new GenerateSchema('./util/exemplos-api/whs-standar.yml');

ob.generateMongooseSchema();
