import express, { Application } from "express";
import {
  exampleTariffPrices,
  consumptionQuery,
} from "./controller/tariffController";

const app: Application = express();

app.get("/", exampleTariffPrices);

app.get("/:consumption", consumptionQuery);

app.listen(3000, () => {});
