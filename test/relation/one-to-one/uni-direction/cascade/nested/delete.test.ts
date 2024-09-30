import { createDataSource, initializeDataSource } from "../../../../../data-source";
import { A } from "./entity/a.entity";
import { B } from "./entity/b.entity";
import { C } from "./entity/c.entity";
import { D } from "./entity/d.entity";
import { E } from "./entity/e.entity";

const dataSource = createDataSource(__dirname);

const createTestData = async () => {
  const a = dataSource.manager.create(A, {
    name: "a",
  });
  await dataSource.manager.save(A, a);

  const b = dataSource.manager.create(B, {
    name: "b",
    a,
  });
  await dataSource.manager.save(B, b);

  const c = dataSource.manager.create(C, {
    name: "c",
    b,
  });
  await dataSource.manager.save(C, c);

  const d = dataSource.manager.create(D, {
    name: "d",
    a,
  });
  await dataSource.manager.save(D, d);

  const e = dataSource.manager.create(E, {
    name: "e",
    d,
  });
  await dataSource.manager.save(E, e);
};

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

beforeEach(async () => {
  await createTestData();
});

afterEach(async () => {
  await dataSource.manager.clear(E);
  await dataSource.manager.clear(D);
  await dataSource.manager.clear(C);
  await dataSource.manager.clear(B);
  await dataSource.manager.clear(A);
});

describe("중첩된 단방향 1:1 cascade 삭제, onDelete 설정됨", () => {
  test("A에서 삭제", async () => {
    await dataSource.manager.clear(A);

    await expect(dataSource.manager.exists(C)).resolves.toBe(false);
    await expect(dataSource.manager.exists(B)).resolves.toBe(false);
    await expect(dataSource.manager.exists(E)).resolves.toBe(false);
    await expect(dataSource.manager.exists(D)).resolves.toBe(false);
    await expect(dataSource.manager.exists(A)).resolves.toBe(false);
  });
});
