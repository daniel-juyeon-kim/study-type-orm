import { createDataSource, initializeDataSource } from "../../../../data-source";
import { Profile } from "./entity/profile.entity";
import { User } from "./entity/user.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

const createUserAndProfile = async () => {
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
};

beforeEach(async () => {
  await createUserAndProfile();
});

afterEach(async () => {
  await dataSource.manager.clear(User);
  await dataSource.manager.clear(Profile);
});

describe("단방향 1:1 삭제 테스트", () => {
  test("성공하는 테스트, profile 삭제", async () => {
    await dataSource.manager.clear(Profile);
    await dataSource.manager.clear(User);

    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
    await expect(dataSource.manager.exists(User)).resolves.toBe(false);
  });

  test.skip.failing("실패하는 테스트, user를 참조하고 있던 profile부터 삭제 해야함", async () => {
    // QueryFailedError: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed
    await dataSource.manager.clear(User);
    await dataSource.manager.clear(Profile);

    await expect(dataSource.manager.exists(User)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });
});
