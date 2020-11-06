import data from "../data/data.json";

interface MinYearlyRate {
  price: number;
  kWhY: number;
}

interface Tariff {
  name: String;
  kwh: number;
  baseCost?: number;
  minYearlyRate?: MinYearlyRate;
}

export interface TarrifWithYearlyConsumption {
  name: String;
  annualCost: number;
}

export const tariffs: Tariff[] = data.tariff;
