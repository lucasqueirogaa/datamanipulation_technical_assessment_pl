import { MongoClient } from "mongodb";
import { IBoxes } from "../../src/types/Boxes";
import supertest from "supertest";
import { server } from "../../src/api";
import { connectToDB, disconnectToDB } from "../../src/config/db";

describe("Boxes endpoint", () => {
  let Boxes: IBoxes[];
  const uri = "mongodb://127.0.0.1:27017/jestdatabase";
  beforeEach(async () => {
    await connectToDB(uri);
  });

  afterAll(async () => {
    await disconnectToDB();
  });

  it("Should create all boxes on DB", async () => {
    const { status } = await supertest(server).post("/read-xls/boxes");

    expect(status).toBe(200);
  });
});
