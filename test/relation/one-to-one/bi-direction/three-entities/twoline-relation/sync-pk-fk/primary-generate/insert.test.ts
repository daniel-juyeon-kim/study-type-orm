import { createDataSource, initializeDataSource } from "../../../../../../../data-source";
import { A } from "./entity/a.entity";
import { B } from "./entity/b.entity";
import { C } from "./entity/c.entity";
import { D } from "./entity/d.entity";
import { E } from "./entity/e.entity";

const dataSource = createDataSource(__dirname);

beforeEach(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await dataSource.manager.clear(C);
  await dataSource.manager.clear(B);
  await dataSource.manager.clear(E);
  await dataSource.manager.clear(D);
  await dataSource.manager.clear(A);

  await dataSource.destroy();
});

/**
 * 상위 엔티티의 pk가 primary generated column이고 하위 엔티티의 pk가 primary column
 */

describe("상위 엔티티로부터 2줄로 3개의 엔티티가 1:1 관계인 엔티티에서 primary generated column와 primary column 동기화 테스트, 상위 엔티티는 primary generated column 하위 엔티티는 primary column", () => {
  test("통과하는 테스트, 상위 엔티티 저장 후 상위 엔티티의 pk를 하위 엔티티에 할당", async () => {
    const aInstance = dataSource.manager.create(A, {
      name: "a",
    });
    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      id: aInstance.id,
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const cInstance = dataSource.manager.create(C, {
      id: aInstance.id,
      name: "c",
      b: bInstance,
    });
    await dataSource.manager.save(C, cInstance);

    const dInstance = dataSource.manager.create(D, {
      id: aInstance.id,
      name: "d",
      a: aInstance,
    });
    await dataSource.manager.save(D, dInstance);

    const eInstance = dataSource.manager.create(E, {
      id: aInstance.id,
      name: "e",
      d: dInstance,
    });
    await dataSource.manager.save(E, eInstance);

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
        c: { id: 1, name: "c" },
      },
      d: {
        id: 1,
        name: "d",
        e: { id: 1, name: "e" },
      },
    });
  });

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

    const dInstance = dataSource.manager.create(D, {
      id: 1,
      name: "d",
      a: aInstance,
    });
    await dataSource.manager.save(D, dInstance);

    const eInstance = dataSource.manager.create(E, {
      id: 1,
      name: "e",
      d: dInstance,
    });
    await dataSource.manager.save(E, eInstance);

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
        c: { id: 1, name: "c" },
      },
      d: {
        id: 1,
        name: "d",
        e: { id: 1, name: "e" },
      },
    });
  });

  test("통과하는 테스트, 상위 엔티티와 중간 엔티티에 pk에 대한 값을 설정", async () => {
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

    const dInstance = dataSource.manager.create(D, {
      id: 1,
      name: "d",
      a: aInstance,
    });
    await dataSource.manager.save(D, dInstance);

    const eInstance = dataSource.manager.create(E, {
      name: "e",
      d: dInstance,
    });
    await dataSource.manager.save(E, eInstance);

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
        c: { id: 1, name: "c" },
      },
      d: {
        id: 1,
        name: "d",
        e: { id: 1, name: "e" },
      },
    });
  });

  test("실패하는 테스트, 상위 엔티티에만 pk값 설정 -> 중간 엔티티와 하위 엔티티의 pk fk가 동기화되지 않음", async () => {
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

    const dInstance = dataSource.manager.create(D, {
      name: "d",
      a: aInstance,
    });
    await dataSource.manager.save(D, dInstance);

    const eInstance = dataSource.manager.create(E, {
      name: "e",
      d: dInstance,
    });
    await dataSource.manager.save(E, eInstance);

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
        c: null,
      },
      d: {
        id: 1,
        name: "d",
        e: null,
      },
    });
  });

  test("실패하는 테스트, 중간 엔티티에만 pk값 설정 -> 중간 엔티티와 하위 엔티티의 pk fk가 동기화되지 않음", async () => {
    const aInstance = dataSource.manager.create(A, {
      name: "a",
    });
    await dataSource.manager.save(A, aInstance);

    const bInstance = dataSource.manager.create(B, {
      id: 3,
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const cInstance = dataSource.manager.create(C, {
      name: "c",
      b: bInstance,
    });
    await dataSource.manager.save(C, cInstance);

    const dInstance = dataSource.manager.create(D, {
      id: 4,
      name: "d",
      a: aInstance,
    });
    await dataSource.manager.save(D, dInstance);

    const eInstance = dataSource.manager.create(E, {
      name: "e",
      d: dInstance,
    });
    await dataSource.manager.save(E, eInstance);

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
        id: 3,
        name: "b",
        c: { id: 1, name: "c" },
      },
      d: {
        id: 4,
        name: "d",
        e: { id: 1, name: "e" },
      },
    });
  });

  test("실패하는 테스트, 하위 엔티티에만 pk값 설정 -> 중간 엔티티와 하위 엔티티의 pk fk가 동기화되지 않음", async () => {
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

    const dInstance = dataSource.manager.create(D, {
      name: "d",
      a: aInstance,
    });
    await dataSource.manager.save(D, dInstance);

    const eInstance = dataSource.manager.create(E, {
      id: 1,
      name: "e",
      d: dInstance,
    });
    await dataSource.manager.save(E, eInstance);

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
        c: null,
      },
      d: {
        id: 1,
        name: "d",
        e: null,
      },
    });
  });
});
