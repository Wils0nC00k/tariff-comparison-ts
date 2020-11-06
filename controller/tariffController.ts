import { TarrifWithYearlyConsumption, tariffs } from "../model/tarrif";
import { Request, Response } from "express";

export const yearlyConsumption = (consumption: number) => {
  let tarrifResult: TarrifWithYearlyConsumption[] = [];

  tariffs.forEach((tarrif) => {
    let annualCost: number;

    const consumptionRemaining =
      tarrif.minYearlyRate && consumption - tarrif.minYearlyRate.kWhY > 0
        ? consumption - tarrif.minYearlyRate.kWhY
        : 0;

    annualCost =
      (tarrif.baseCost ? tarrif.baseCost * 12 : 0) +
      (tarrif.minYearlyRate
        ? tarrif.minYearlyRate.price + consumptionRemaining * tarrif.kwh
        : consumption * tarrif.kwh);

    tarrifResult.push({
      name: tarrif.name,
      annualCost,
    });
  });

  return tarrifResult.sort(
    (firstTariff, secondTariff) =>
      firstTariff.annualCost - secondTariff.annualCost
  );
};

export const exampleTariffPrices = (req: Request, res: Response) => {
  res.send([
    "Comapare tariffs against consumption, eg <url>/5000",
    { kWhYear: 3500, tariffs: yearlyConsumption(3500) },
    { kWhYear: 4500, tariffs: yearlyConsumption(4500) },
    { kWhYear: 6000, tariffs: yearlyConsumption(6000) },
  ]);
};

export const consumptionQuery = (req: Request, res: Response) => {
  if (req.params.consumption.match(/^[0-9]+$/) !== null) {
    const consumption = parseInt(req.params.consumption);
    res.send(yearlyConsumption(consumption));
  } else {
    res.send("Please enter a number, eg. 4500");
  }
};

export const handleBadRequest = (req: Request, res: Response) => {
  res.status(404).send("Oh no! Page not found :'(");
};
