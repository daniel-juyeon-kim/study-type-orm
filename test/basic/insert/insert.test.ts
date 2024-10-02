import { createDataSource, initializeDataSource } from "../../data-source";
import { A } from "./entity/a.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await dataSource.manager.clear(A);
});

describe("단순 엔티티 저장 테스트", () => {
  test("통과하는 테스트, primary column에 값을 설정하지 않은 테스트", async () => {
    // primary column을 설정했지만 저장시 엔티티에 별도의 값 설정을 안하더라도 잘 동작한다, 대신 pk에 대한 값이 자동적으로 설정된다.
    const aInstance = dataSource.manager.create(A, {
      name: "이름",
    });

    await dataSource.manager.save(A, aInstance);
    const a = await dataSource.manager.findOne(A, { where: { name: "이름" } });

    expect(a).toEqual({ id: 1, name: "이름" });
  });

  test("통과하는 테스트, primary column에 값을 설정한 테스트", async () => {
    const aInstance = dataSource.manager.create(A, {
      id: 1,
      name: "이름",
    });

    await dataSource.manager.save(A, aInstance);
    const a = await dataSource.manager.findOne(A, { where: { name: "이름" } });

    expect(a).toEqual({ id: 1, name: "이름" });
  });
});
