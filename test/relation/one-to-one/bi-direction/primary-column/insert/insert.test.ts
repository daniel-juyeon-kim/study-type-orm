import { createDataSource, initializeDataSource } from "../../../../../data-source";
import { A } from "./entity/a.entity";
import { B } from "./entity/b.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await dataSource.manager.clear(B);
  await dataSource.manager.clear(A);
});

/**
 * 엔티티 2개가 상위 엔티티 하위 엔티티로 1:1 관계이고 각 엔티티의 pk가 primary column일 때
 * - 상위 엔티티와 하위 엔티티에 pk로 같은 값 할당
 * - 상위 엔티티 저장 후 상위 엔티티의 pk를 하위 엔티티에 할당
 * - 상위 엔티티에 pk를 설정하는것으로 하위 엔티티에 자동으로 적용됨(엔티티 2개 한정)
 */

describe("엔티티 2개가 상위 하위 엔티티로 1:1 관계이고 각 엔티티의 pk가 primary column일 때", () => {
  test("통과하는 테스트, 상위 엔티티 저장 후 상위 엔티티의 pk를 하위 엔티티에 할당", async () => {
    const aInstance = dataSource.manager.create(A, {
      id: 1,
      name: "a",
    });

    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      id: aInstance.id,
      name: "b",
      a: aInstance,
    });

    await dataSource.manager.save(B, bInstance);

    const b = await dataSource.manager.findOne(B, {
      relations: { a: true },
      where: { name: "b" },
    });

    expect(b).toEqual({
      id: 1,
      name: "b",
      a: { id: 1, name: "a" },
    });
  });

  test("통과하는 테스트, 상위 엔티티 하위 엔티티에 같은 pk값 설정", async () => {
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

    const b = await dataSource.manager.findOne(B, {
      relations: { a: true },
      where: { name: "b" },
    });

    expect(b).toEqual({
      id: 1,
      name: "b",
      a: { id: 1, name: "a" },
    });
  });

  test("성공하는 테스트, 상위 엔티티에만 pk값 설정", async () => {
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
    const b = await dataSource.manager.findOne(B, {
      relations: { a: true },
      where: { name: "b" },
    });

    expect(b).toEqual({
      id: 1,
      name: "b",
      a: { id: 1, name: "a" },
    });
  });

  test("실패하는 테스트, 하위 엔티티에만 pk값 설정 -> join불가", async () => {
    const aInstance = dataSource.manager.create(A, {
      name: "a",
    });
    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      id: 1,
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const b = await dataSource.manager.findOne(B, {
      relations: { a: true },
      where: { name: "b" },
    });

    expect(b).toEqual({ a: null, id: 1, name: "b" });
  });

  test("실패하는 테스트, 상위 하위 엔티티 둘 다 pk값 설정 안함 -> join불가", async () => {
    const aInstance = dataSource.manager.create(A, {
      name: "a",
    });

    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      name: "b",
      a: aInstance,
    });

    await dataSource.manager.save(B, bInstance);
    const b = await dataSource.manager.findOne(B, {
      relations: { a: true },
      where: { name: "b" },
    });

    expect(b).toEqual({ a: null, id: 1, name: "b" });
  });
});
