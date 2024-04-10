import * as dotenv from "dotenv";
import { initServer } from "./app/index";

dotenv.config();


const init = async() => {
    const app = await initServer();
    app.listen(process.env.PORT || 1010, () => console.log(`Server Started at PORT:8080`))
}



init();