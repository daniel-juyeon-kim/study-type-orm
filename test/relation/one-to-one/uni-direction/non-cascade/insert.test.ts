import { createDataSource, initializeDataSource } from "../../../../data-source";
import { Profile } from "./entity/profile.entity";
import { User } from "./entity/user.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await Promise.allSettled([dataSource.manager.clear(Profile), dataSource.manager.clear(User)]);
});

describe("단방향 1:1 저장 (relation이 설정되어 있다면 저장 순서가 중요함, 순서에 맞게 저장해야 join결과가 예상대로 나옴)", () => {
  test("join이 성공하는 테스트", async () => {
    // 참조당하는 엔티티가 먼저 생성되고 저장되야 함
    const user = dataSource.manager.create(User, {
      name: "이름",
    });

    await dataSource.manager.save(User, user);

    // 참조하는 엔티티는 참조당하는 엔티티가 저장된 후 작업 실행
    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
      user, // user 엔티티 인스턴스 연결
    });

    await dataSource.manager.save(Profile, profile);

    const joinResult = await dataSource.manager.findOne(Profile, {
      relations: { user: true },
      where: { photo: "사진 정보" },
    });

    expect(joinResult).toEqual({
      id: 1,
      gender: "성별",
      photo: "사진 정보",
      user: {
        id: 1,
        name: "이름",
      },
    });
  });

  test("join이 실패하는 테스트, join속성을 추가 안함, 저장은 됨", async () => {
    const user = dataSource.manager.create(User, {
      name: "이름",
    });

    await dataSource.manager.save(User, user);

    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
      // user 속성 추가 안함
    });

    await dataSource.manager.save(Profile, profile);

    // 저장은 제대로 됨
    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);

    const joinResult = await dataSource.manager.findOne(Profile, {
      relations: { user: true },
      where: { photo: "사진 정보" },
    });

    // 그러나 join 불가함
    expect(joinResult).toEqual({
      id: 2,
      gender: "성별",
      photo: "사진 정보",
      user: null,
    });
  });

  test.failing("join이 실패하는 테스트, 엔티티 인스턴스를 생성하고 바로 저장 안함, 저장은 됨", async () => {
    // UpdateValuesMissingError: Cannot perform update query because update values are not defined. Call "qb.set(...)" method to specify updated values.

    // user 엔티티를 생성했으나 바로 저장하지 않음
    const user = dataSource.manager.create(User, {
      name: "이름",
    });

    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
      user, // user 엔티티 인스턴스 연결
    });

    // 저장을 뒤로 미룸
    await dataSource.manager.save(User, user);
    await dataSource.manager.save(Profile, profile);

    // 저장은 제대로 됨
    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);

    const joinResult = await dataSource.manager.findOne(Profile, {
      relations: { user: true },
      where: { photo: "사진 정보" },
    });

    // 그러나 join은 제대로 동작하지 않음
    expect(joinResult).toEqual({
      id: 1,
      gender: "성별",
      photo: "사진 정보",
      user: null,
    });
  });
});
