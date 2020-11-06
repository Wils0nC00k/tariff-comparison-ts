import data from "../data/data.json";

interface MinYearlyRate {
  price: number;
  kWhY: number;
}

interface Tariff {
  name: String;
  baseCost?: number;
  minYearlyRate?: MinYearlyRate;
  kwh: number;
}

export interface TarrifWithYearlyConsumption {
  name: String;
  annualCost: number;
}

export const tariffs: Tariff[] = data.tariff;
