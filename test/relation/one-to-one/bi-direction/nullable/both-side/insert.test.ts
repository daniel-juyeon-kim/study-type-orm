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

describe("양방향 1:1 not null 저장", () => {
  test("성공하는 앵방향 1:1 not null 저장", async () => {
    // joinColumn이 없는 반대편 엔티티에서 nullable false
    // QueryFailedError: SQLITE_CONSTRAINT: NOT NULL constraint failed: profile.userId
    const user = dataSource.manager.create(User, {
      name: "이름",
    });
    await dataSource.manager.save(User, user);
    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
      user,
    });

    await dataSource.manager.save(Profile, profile);

    await expect(dataSource.manager.count(User)).resolves.toBe(1);
    await expect(dataSource.manager.count(Profile)).resolves.toBe(1);
  });

  test.failing(
    "실패하는 1:1 not null 저장, SQLITE_CONSTRAINT: NOT NULL constraint failed: profile.userId",
    async () => {
      const profile = dataSource.manager.create(Profile, {
        gender: "성별",
        photo: "사진 정보",
      });

      // profile엔티티에 user에 대한 fk 속성이 존재하고 nullable false 이므로 해당속성을 설정하지 않으면 문제가 발생함
      await dataSource.manager.save(Profile, profile);

      const user = dataSource.manager.create(User, {
        name: "이름",
        profile,
      });

      await dataSource.manager.save(User, user);

      await expect(dataSource.manager.count(User)).resolves.toBe(1);
      await expect(dataSource.manager.count(Profile)).resolves.toBe(1);
    },
  );
});
