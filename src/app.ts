import * as dotenv from "dotenv";
import { initServer } from "./app/index";

import cluster from 'node:cluster';
const numCPUs = require('node:os').availableParallelism();

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
}else{
    dotenv.config();
    const init = async() => {
        const app = await initServer();
        app.listen(process.env.PORT || 1010, () => console.log(`Server Started at PORT:8080`))
    }
    init();
}


