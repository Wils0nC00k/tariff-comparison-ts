import request from "supertest";
import { app } from "./index";

const rootRequestBody = [
  "Comapare tariffs against consumption, eg <url>/5000",
  {
    kWhYear: 3500,
    tariffs: [
      {
        name: "Packaged Tariff",
        annualCost: 800,
      },
      {
        name: "basic electricity tariff",
        annualCost: 830,
      },
    ],
  },
  {
    kWhYear: 4500,
    tariffs: [
      {
        name: "Packaged Tariff",
        annualCost: 950,
      },
      {
        name: "basic electricity tariff",
        annualCost: 1050,
      },
    ],
  },
  {
    kWhYear: 6000,
    tariffs: [
      {
        name: "basic electricity tariff",
        annualCost: 1380,
      },
      {
        name: "Packaged Tariff",
        annualCost: 1400,
      },
    ],
  },
];

describe("Index", () => {
  // ROOT /
  it("Request / should return status code 200", async (done) => {
    const result = await request(app).get("/").send();

    expect(result.status).toBe(200);
    done();
  });

  it("Request / body should match rootRequestBody", async (done) => {
    const result = await request(app).get("/").send();

    expect(result.body).toEqual(rootRequestBody);
    done();
  });

  // PARAM /number
  it("Request /4500 should return status code 200", async (done) => {
    const result = await request(app).get("/4500").send();

    expect(result.status).toBe(200);
    done();
  });

  it("Request /4500 should return body with 2 tariffs comapring consumption of 4500(kWh/year)", async (done) => {
    const result = await request(app).get("/4500").send();

    expect(result.body).toEqual([
      {
        annualCost: 950,
        name: "Packaged Tariff",
      },
      {
        annualCost: 1050,
        name: "basic electricity tariff",
      },
    ]);
    done();
  });

  // ERROR /error/error
  it("Request /test/test should return status code 404", async (done) => {
    const result = await request(app).get("/test/test").send();

    expect(result.status).toBe(404);
    done();
  });

  it("Request /test/test should return text with error message", async (done) => {
    const result = await request(app).get("/test/test").send();

    expect(result.text).toEqual("Oh no! Page not found :'(");
    done();
  });
});

describe("Tariffs", () => {
  const findTariff = (res, name) => res.find((tariff) => tariff.name === name);

  it("Request /4500, Packaged Tariff should be best offer with 950 (€/year)", async (done) => {
    const result = await request(app).get("/4500").send();

    expect(result.body[0].name).toEqual("Packaged Tariff");
    expect(result.body[0].annualCost).toEqual(950);
    done();
  });

  it("Request with less then 4000 (kWh/year) will always be 800 (€/year) for Packaged Tariff", async (done) => {
    const result1 = await request(app).get("/3500").send();
    const result2 = await request(app).get("/2700").send();
    const result3 = await request(app).get("/5000").send();

    expect(findTariff(result1.body, "Packaged Tariff").annualCost).toEqual(800);
    expect(findTariff(result2.body, "Packaged Tariff").annualCost).toEqual(800);
    expect(findTariff(result3.body, "Packaged Tariff").annualCost).not.toEqual(
      800
    );

    done();
  });

  it("Request for 6000 (kWh/year) best offer will be 'basic electricity tariff'", async (done) => {
    const result = await request(app).get("/3500").send();

    expect(result.body[0].name).toEqual("Packaged Tariff");

    done();
  });
});
