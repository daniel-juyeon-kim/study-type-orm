import { IsNull } from "typeorm";
import { createDataSource, initializeDataSource } from "../../data-source";
import { A } from "./entity/a.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

beforeEach(async () => {
  await dataSource.manager.save(A, {
    name: "이름",
    age: 1,
    detail: "세부사항",
  });

  await dataSource.manager.save(A, {
    name: "홍길동",
    age: 1,
  });
});

afterEach(async () => {
  await dataSource.manager.clear(A);
});

describe("select option 테스트", () => {
  test("성공: 속성값으로 true 설정", async () => {
    const data = await dataSource.manager.findOne(A, {
      where: { name: "이름" },
      select: {
        age: true,
      },
    });

    expect(data).toEqual({
      age: 1,
    });
  });

  test("실패: 속성값으로 false 설정", async () => {
    const data = await dataSource.manager.findOne(A, {
      where: { name: "이름" },
      select: {
        // select의 속성값으로 false는 의미없음
        age: false,
      },
    });

    expect(data).toEqual({
      id: 1,
      name: "이름",
      age: 1,
      detail: "세부사항",
    });
  });
});

describe("where option 테스트", () => {
  test("성공: IsNull 테스트", async () => {
    const data = await dataSource.manager.findOne(A, {
      where: {
        detail: IsNull(),
      },
    });

    expect(data).toEqual({
      id: 2,
      name: "홍길동",
      age: 1,
      detail: null,
    });
  });

  test("실패: undefined 테스트", async () => {
    const data = await dataSource.manager.findOne(A, {
      where: {
        detail: undefined,
      },
    });

    expect(data).not.toEqual({
      id: 2,
      name: "홍길동",
      age: 1,
      detail: null,
    });
  });
});
