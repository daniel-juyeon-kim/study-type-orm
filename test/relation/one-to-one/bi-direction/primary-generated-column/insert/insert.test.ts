import { createDataSource, initializeDataSource } from "../../../../../data-source";
import { A } from "./entity/a.entity";
import { B } from "./entity/b.entity";

const dataSource = createDataSource(__dirname);

beforeEach(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await dataSource.manager.clear(B);
  await dataSource.manager.clear(A);

  await dataSource.destroy();
});

/**
 * 엔티티 2개가 상위 하위 엔티티로 양방향 1:1 관계이고 상위 엔티티가 primary generated column, 하위 엔티티가 primary column일 때 두 엔티티의 pk fk를 동기화 하는 테스트
 * - 상위 엔티티를 저장 후 pk값을 하위 엔티티에 할당하는게 제일 이상적임
 * - 상위 엔티티와 하위 엔티티의 동일한 값의 pk를 설정
 * - 모든 엔티티에 pk값을 설정 안 해도 됨
 * - 상위 엔티티에 pk값을 설정해도 됨
 */

describe("엔티티 2개가 상위 하위 엔티티로 양방향 1:1 관계이고 상위 엔티티가 primary generated column, 하위 엔티티가 primary column일 때 두 엔티티의 pk fk를 동기화 하는 테스트", () => {
  test("통과하는 테스트, 상위 엔티티에서 자동으로 생성된 pk를 하위 엔티티에 할당", async () => {
    const aInstance = dataSource.manager.create(A, {
      id: 3,
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
      id: 3,
      name: "b",
      a: { id: 3, name: "a" },
    });
  });

  test("통과하는 테스트, 상위 엔티티 하위 엔티티에 같은 pk값을 할당", async () => {
    const aInstance = dataSource.manager.create(A, {
      id: 3,
      name: "a",
    });

    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      id: 3,
      name: "b",
      a: aInstance,
    });

    await dataSource.manager.save(B, bInstance);

    const b = await dataSource.manager.findOne(B, {
      relations: { a: true },
      where: { name: "b" },
    });

    expect(b).toEqual({
      id: 3,
      name: "b",
      a: { id: 3, name: "a" },
    });
  });

  test("통과하는 테스트, 상위 엔티티 하위 엔티티에 pk에 대한 값을 설정하지 않음", async () => {
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

    expect(b).toEqual({
      id: 1,
      name: "b",
      a: { id: 1, name: "a" },
    });
  });

  test("통과하는 테스트, 상위 엔티티에만 pk값을 설정", async () => {
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

  test("통과하는 테스트, 하위 엔티티에만 pk값 설정", async () => {
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

    const b = await dataSource.manager.findOne(B, {
      relations: { a: true },
      where: { name: "b" },
    });

    expect(b).toEqual({
      id: 4,
      name: "b",
      a: { id: 1, name: "a" },
    });
  });
});
