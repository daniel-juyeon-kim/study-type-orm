import { createDataSource, initializeDataSource } from "../../../../../../../data-source";
import { Profile } from "./entity/profile.entity";
import { User } from "./entity/user.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

beforeEach(async () => {
  await dataSource.manager.clear(Profile);
  await dataSource.manager.clear(User);
});

describe("양방향 1:1 cascade 저장", () => {
  test("성공하는 테스트, user에서 저장", async () => {
    const user = dataSource.manager.create(User, {
      name: "이름",
      profile: {
        photo: "사진 정보",
        gender: "성별",
      },
    });
    // QueryFailedError: SQLITE_CONSTRAINT: NOT NULL constraint failed: profile.gender
    await dataSource.manager.save(User, user);

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
  });

  test("성공하는 테스트, profile에서 저장", async () => {
    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
      user: {
        name: "이름",
      },
    });

    await dataSource.manager.save(Profile, profile);

    await expect(dataSource.manager.count(User)).resolves.toBe(1);
    await expect(dataSource.manager.count(Profile)).resolves.toBe(1);
  });
});
