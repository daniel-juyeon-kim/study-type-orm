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
  await createTestData();
});

describe("중첩된 단방향 1:1 cascade 조회", () => {
  test("성공하는 테스트, joinColumn을 가지는 엔티티에서 조회", async () => {
    const c = await dataSource.manager.findOne(C, {
      relations: {
        b: {
          a: true,
        },
      },
      where: {
        name: "c",
      },
    });

    const e = await dataSource.manager.findOne(E, {
      relations: {
        d: {
          a: true,
        },
      },
      where: {
        name: "e",
      },
    });

    expect(c).toEqual({
      id: 1,
      name: "c",
      b: {
        id: 1,
        name: "b",
        a: {
          id: 1,
          name: "a",
        },
      },
    });
    expect(e).toEqual({
      id: 1,
      name: "e",
      d: {
        id: 1,
        name: "d",
        a: {
          id: 1,
          name: "a",
        },
      },
    });
  });
});
