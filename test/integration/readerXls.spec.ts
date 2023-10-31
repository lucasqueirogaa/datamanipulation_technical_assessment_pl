import supertest from "supertest";
import { server } from "../../src/api";
import { connectToDB, disconnectToDB } from "../../src/config/db";

describe("Reader Xls endpoints", () => {
  const uri = "mongodb://127.0.0.1:27017/jestdatabase";
  beforeEach(async () => {
    await connectToDB(uri);
  });

  afterAll(async () => {
    await disconnectToDB();
  });

  it("Should create all boxes on DB", async () => {
    const { status, body } = await supertest(server).post("/read-xls/boxes");

    expect(status).toBe(200);
    expect(body.Boxes.length).toBe(68);
    expect(body.Boxes[0]).toHaveProperty("name");
    expect(body.Boxes[0]).toHaveProperty("lat");
    expect(body.Boxes[0]).toHaveProperty("lng");
    expect(body.Boxes[0]).toHaveProperty("boxType");
    expect(body.Boxes[0]).toHaveProperty("project");
    expect(body.Boxes[0]).toHaveProperty("hierarchyLevel");
  });

  it("Should create all splitters on DB", async () => {
    const { status, body } = await supertest(server).post(
      "/read-xls/splitters"
    );

    expect(status).toBe(200);
    expect(body.Splitters.length).toBe(94);
    expect(body.Splitters[0]).toHaveProperty("implanted");
    expect(body.Splitters[0]).toHaveProperty("isDrop");
    expect(body.Splitters[0]).toHaveProperty("parent");
    expect(body.Splitters[0]).toHaveProperty("project");
    expect(body.Splitters[0]).toHaveProperty("name");
    expect(body.Splitters[0]).toHaveProperty("splitterType");
    expect(body.Splitters[0]).toHaveProperty("ratio");
  });
});
