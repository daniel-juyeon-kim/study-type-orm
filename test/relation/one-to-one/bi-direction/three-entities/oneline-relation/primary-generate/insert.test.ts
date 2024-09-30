import { createDataSource, initializeDataSource } from "../../../../../../data-source";
import { A } from "./entity/a.entity";
import { B } from "./entity/b.entity";
import { C } from "./entity/c.entity";

const dataSource = createDataSource(__dirname);

beforeEach(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await dataSource.manager.clear(C);
  await dataSource.manager.clear(B);
  await dataSource.manager.clear(A);

  await dataSource.destroy();
});

/**
 * 상위 엔티티의 pk가 primary generated column이고 하위 엔티티의 pk가 primary column일때
 * - 모든 엔티티에 같은 id 값 설정
 * - 상위 엔티티와 바로 아래(중간) 엔티티에 pk 설정, 통일
 * - 중간 엔티티에 pk 생성
 */

describe("3개의 엔티티가 한 줄로 1:1 관계에서 primary generated column와 primary column 동기화 테스트, 상위 엔티티는 primary generated column 하위 엔티티는 primary column", () => {
  test("통과하는 테스트, 모든 엔티티에 pk에 대한 값 설정", async () => {
    const aInstance = dataSource.manager.create(A, {
      id: 1,
      name: "a",
    });
    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      id: 1,
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const cInstance = dataSource.manager.create(C, {
      id: 1,
      name: "c",
      b: bInstance,
    });
    await dataSource.manager.save(C, cInstance);

    const c = await dataSource.manager.findOne(C, {
      relations: {
        b: {
          a: true,
        },
      },
      where: { name: "c" },
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
  });

  test("통과하는 테스트, 상위 중간 엔티티에 pk에 대한 값을 설정", async () => {
    const aInstance = dataSource.manager.create(A, {
      id: 1,
      name: "a",
    });
    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      id: 1,
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const cInstance = dataSource.manager.create(C, {
      name: "c",
      b: bInstance,
    });
    await dataSource.manager.save(C, cInstance);

    const c = await dataSource.manager.findOne(C, {
      relations: {
        b: {
          a: true,
        },
      },
      where: { name: "c" },
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
  });

  test("실패하는 테스트, 중간 엔티티에만 임의의 pk값을 설정", async () => {
    const aInstance = dataSource.manager.create(A, {
      name: "a",
    });
    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      id: 4,
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const cInstance = dataSource.manager.create(C, {
      name: "c",
      b: bInstance,
    });
    await dataSource.manager.save(C, cInstance);

    const c = await dataSource.manager.findOne(C, {
      relations: {
        b: {
          a: true,
        },
      },
      where: { name: "c" },
    });

    expect(c).toEqual({
      id: 1,
      name: "c",
      b: {
        id: 4,
        name: "b",
        a: { id: 1, name: "a" },
      },
    });
  });

  test("실패하는 테스트, 상위 엔티티에 pk값 설정", async () => {
    const aInstance = dataSource.manager.create(A, {
      id: 1,
      name: "a",
    });
    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const cInstance = dataSource.manager.create(C, {
      name: "c",
      b: bInstance,
    });
    await dataSource.manager.save(C, cInstance);

    const c = await dataSource.manager.findOne(C, {
      relations: {
        b: {
          a: true,
        },
      },
      where: { name: "c" },
    });

    expect(c).toEqual({
      id: 1,
      name: "c",
      b: null,
    });
  });

  test("실패하는 테스트, 최하위 엔티티에만 pk값 설정 -> 상위 엔티티와 중간 엔티티 join 불가", async () => {
    const aInstance = dataSource.manager.create(A, {
      name: "a",
    });
    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const cInstance = dataSource.manager.create(C, {
      id: 1,
      name: "c",
      b: bInstance,
    });
    await dataSource.manager.save(C, cInstance);

    const c = await dataSource.manager.findOne(C, {
      relations: {
        b: {
          a: true,
        },
      },
      where: { name: "c" },
    });

    expect(c).toEqual({
      id: 1,
      name: "c",
      b: null,
    });
  });
});
