import { createDataSource, initializeDataSource } from "../../../../../../../data-source";
import { A } from "./entity/a.entity";
import { B } from "./entity/b.entity";
import { C } from "./entity/c.entity";
import { D } from "./entity/d.entity";
import { E } from "./entity/e.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await dataSource.manager.clear(E);
  await dataSource.manager.clear(D);
  await dataSource.manager.clear(C);
  await dataSource.manager.clear(B);
  await dataSource.manager.clear(A);
});

describe("중첩된 양방향 1:1 cascade 저장, cascade 설정이 되어있으면 반드시 한번에 저장해야 함 그래야 join이 제대로 동작함", () => {
  test("성공하는 테스트, 상위 엔티티 인스턴스 생성 후 저장", async () => {
    const a = dataSource.manager.create(A, {
      name: "a",
      b: {
        name: "b",
        c: {
          name: "c",
        },
      },
      d: {
        name: "d",
        e: {
          name: "e",
        },
      },
    });

    await dataSource.manager.save(A, a);

    const aInstance = await dataSource.manager.findOne(A, {
      relations: {
        b: { c: true },
        d: { e: true },
      },
      where: { name: "a" },
    });

    expect(aInstance).toEqual({
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

  test("성공하는 테스트, 각각 엔티티 인스턴스 생성 후 저장", async () => {
    const e = dataSource.manager.create(E, {
      name: "e",
    });

    const d = dataSource.manager.create(D, {
      name: "d",
      e,
    });

    const c = dataSource.manager.create(C, {
      name: "c",
    });

    const b = dataSource.manager.create(B, {
      name: "b",
      c,
    });

    const a = dataSource.manager.create(A, {
      name: "a",
      b,
      d,
    });
    await dataSource.manager.save(A, a);

    const aInstance = await dataSource.manager.findOne(A, {
      relations: {
        b: { c: true },
        d: { e: true },
      },
      where: { name: "a" },
    });

    expect(aInstance).toEqual({
      id: 2,
      name: "a",
      b: {
        id: 2,
        name: "b",
        c: {
          id: 2,
          name: "c",
        },
      },
      d: {
        id: 2,
        name: "d",
        e: {
          id: 2,
          name: "e",
        },
      },
    });
  });
});
