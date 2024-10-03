import { createDataSource, initializeDataSource } from "../../../../../data-source";
import { Profile } from "./entity/profile.entity";
import { User } from "./entity/user.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await Promise.allSettled([dataSource.manager.clear(User), dataSource.manager.clear(Profile)]);
});

describe("단방향 1:1 not null 저장", () => {
  test("성공하는 단방향 1:1 not null 저장", async () => {
    // profile.user는 nullable
    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
    });
    await dataSource.manager.save(Profile, profile);

    // user.profile은 nullable false
    const user = dataSource.manager.create(User, {
      name: "이름",
      profile,
    });

    await dataSource.manager.save(User, user);

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
  });

  test.failing(
    "실패하는 1:1 not null 저장, SQLITE_CONSTRAINT: NOT NULL constraint failed: profile.userId",
    async () => {
      // profile.user는 nullable
      const user = dataSource.manager.create(User, {
        name: "이름",
      });

      // user 엔티티를 생성하고 바로 저장해야 오류가 발생하지 않음
      // user엔티티를 저장해야 user.id에 대한 정보가 생성되기 때문

      // UpdateValuesMissingError: Cannot perform update query because update values are not defined. Call "qb.set(...)" method to specify updated values.

      const profile = dataSource.manager.create(Profile, {
        gender: "성별",
        photo: "사진 정보",
        user,
      });

      await dataSource.manager.save(User, user);
      await dataSource.manager.save(Profile, profile);

      // user.profile은 nullable false

      await expect(dataSource.manager.exists(User)).resolves.toBe(true);
      await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
    },
  );

  test("실패하는 1:1 not null 저장, SQLITE_CONSTRAINT: NOT NULL constraint failed: profile.userId", async () => {
    // user.profile은 nullable:false 이지만 profile에 대한 fk를 가지진 않으므로 저장을 해도 문제가 발생하지 않음
    // 즉 nullable:false를 설정한 의미가 없음 -> nullable:false가 의미있는 경우는 joinColumn과 일반 컬럼일때
    // 아래 코드는 저장은 가능하지만 join을 안됨
    const user = dataSource.manager.create(User, {
      name: "이름",
    });

    await dataSource.manager.save(User, user);

    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
    });

    await dataSource.manager.save(Profile, profile);

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
    await expect(
      dataSource.manager.findOne(User, {
        relations: { profile: true },
        where: { name: "이름" },
      }),
    ).resolves.toEqual({
      id: 3,
      name: "이름",
      profile: null,
    });
  });
});
