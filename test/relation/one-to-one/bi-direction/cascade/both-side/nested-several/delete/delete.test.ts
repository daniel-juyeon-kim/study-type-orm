import { createDataSource, initializeDataSource } from "../../../../../../../data-source";
import { A } from "./entity/a.entity";
import { B } from "./entity/b.entity";
import { C } from "./entity/c.entity";
import { D } from "./entity/d.entity";
import { E } from "./entity/e.entity";

const dataSource = createDataSource(__dirname);

const createTestData = async () => {
  const e = dataSource.manager.create(E, {
    name: "e",
  });
  await dataSource.manager.save(E, e);

  const d = dataSource.manager.create(D, {
    name: "d",
    e,
  });
  await dataSource.manager.save(D, d);

  const c = dataSource.manager.create(C, {
    name: "c",
  });
  await dataSource.manager.save(C, c);

  const b = dataSource.manager.create(B, {
    name: "b",
    c,
  });
  await dataSource.manager.save(B, b);

  const a = dataSource.manager.create(A, {
    name: "a",
    b,
    d,
  });
  await dataSource.manager.save(A, a);
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

describe("중첩된 양방향 1:1 cascade 삭제, 전부 cascade onDelete가 설정되어 있음", () => {
  test("성공하는 테스트, A에서 삭제", async () => {
    await dataSource.manager.clear(A);

    await expect(dataSource.manager.exists(A)).resolves.toBe(false);
    await expect(dataSource.manager.exists(B)).resolves.toBe(false);
    await expect(dataSource.manager.exists(C)).resolves.toBe(false);
    await expect(dataSource.manager.exists(D)).resolves.toBe(false);
    await expect(dataSource.manager.exists(E)).resolves.toBe(false);
  });
});
