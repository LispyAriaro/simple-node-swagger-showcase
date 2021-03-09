import { Logger } from "tslog";

const log: Logger = new Logger({
  name: "T.G", 
  maskValuesOfKeys: ['password', 'token', 'x-access-token']
})

export default log
