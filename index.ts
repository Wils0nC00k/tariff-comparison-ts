import express, { Application } from "express";
import {
  exampleTariffPrices,
  consumptionQuery,
  handleBadRequest,
} from "./controller/tariffController";

export const app: Application = express();
const port = 3000;

app.get("/", exampleTariffPrices);

app.get("/:consumption", consumptionQuery);

app.use(handleBadRequest);

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
