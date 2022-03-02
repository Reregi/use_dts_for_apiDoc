const fs = require("fs");
const Formal = fs.readFileSync("json/apiDemo/formal.json", "utf8");
const Type = fs.readFileSync("json/apiDemo/type.json", "utf8");
const Enum = fs.readFileSync("json/apiDemo/enum.json", "utf8");
const generateUtils = require("./utils");

generateUtils.generateDts("ApiDemo", Formal, Type, Enum);
generateUtils.generateTs("ApiDemo", Enum);
