import { createDataSource, initializeDataSource } from "../../../../data-source";
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

describe("양방향 1:1 저장 테스트", () => {
  test("성공하는 테스트, user 저장 후 profile 저장", async () => {
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

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
  });

  test("성공하는 테스트, 양방향 1:1이라서 어느쪽에 연결해도 상관없음", async () => {
    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
    });

    await dataSource.manager.save(Profile, profile);

    const user = dataSource.manager.create(User, {
      name: "이름",
      profile,
    });

    await dataSource.manager.save(User, user);

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
  });
});
