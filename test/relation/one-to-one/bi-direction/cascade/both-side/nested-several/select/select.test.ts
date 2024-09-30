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

describe("중첩된 양방향 1:1 조회", () => {
  test("상위 엔티티에서 연관된 모든 엔티티 조회", async () => {
    // NOTE: cascade insert한 내용에 대해 join으로 조회가 되지 않는다면 저장을 하는 방법이 잘못됨
    const a = await dataSource.manager.findOne(A, {
      relations: {
        b: { c: true },
        d: { e: true },
      },
      where: { name: "a" },
    });

    expect(a).toEqual({
      id: 1,
      name: "a",
      b: {
        id: 1,
        name: "b",
        c: {
          id: 1,
          name: "c",
        },
      },
      d: {
        id: 1,
        name: "d",
        e: {
          id: 1,
          name: "e",
        },
      },
    });
  });
});
