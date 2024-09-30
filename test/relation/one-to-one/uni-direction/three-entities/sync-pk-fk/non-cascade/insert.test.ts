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
 * 상위 엔티티의 pk가 primary generated column이고 하위 엔티티의 pk가 primary column
 *
 * 정상적으로 데이터를 저장하는 방법
 * - 모든 엔티티에 같은 pk값 적용
 * - 상위 엔티티 중간 엔티티에 같은 pk값 적용
 * - 중간 엔티티에만 pk 값 적용
 * - 상위 엔티티의 엔티티 인스턴스를 생성후 하위 엔티티의 pk에 상위 엔티티의 pk값을 할당
 *  - 상위 엔티티 인스턴스 생성 -> 저장 후 상위 엔티티 인스턴스의 pk를 하위 엔티티에 할당
 *    (상위 엔티티 인스턴스를 저장하고 나서 해당 인스턴스에 pk값이 추가되고 이 pk값을 하위 엔티티에 할당해야 함)
 */

describe("1:1 단방향 primary generated column값을 연관 엔티티와 공유하는 테스트, 상위 엔티티는 primary generated column 하위 엔티티는 primary column", () => {
  test("통과하는 테스트, 상위 엔티티 생성 저장 후 상위 엔티티의 pk 속성을 하위 엔티티의 pk에 적용", async () => {
    const aInstance = dataSource.manager.create(A, {
      name: "a",
    });
    // aInstance.id(pk)가 존재하지 않음
    await dataSource.manager.save(A, aInstance);
    // aInstance.id(pk)가 존재함

    const bInstance = dataSource.manager.create(B, {
      id: aInstance.id,
      name: "b",
      a: aInstance,
    });
    await dataSource.manager.save(B, bInstance);

    const cInstance = dataSource.manager.create(C, {
      id: bInstance.id,
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

  test("통과하는 테스트, 중간 엔티티에만 pk값을 설정", async () => {
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

  test("실패하는 테스트, 모든 엔티티에 pk값 설정 안함", async () => {
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

  test("실패하는 테스트, 상위 하위 엔티티에 pk에 대한 값을 설정하지 않음", async () => {
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

  test("실패하는 테스트, 상위 엔티티에만 pk 설정", async () => {
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

  test("실패하는 테스트, 최하위 엔티티에만 pk값 설정 -> 실행 불가", async () => {
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
