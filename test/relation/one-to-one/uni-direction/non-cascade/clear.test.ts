import { createDataSource, initializeDataSource } from "../../../../data-source";
import { Profile } from "./entity/profile.entity";
import { User } from "./entity/user.entity";

const createUserAndProfile = async () => {
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
};

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

beforeEach(async () => {
  await createUserAndProfile();
});

afterEach(async () => {
  await dataSource.manager.clear(Profile);
  await dataSource.manager.clear(User);
});

describe("단방향 1:1 삭제 테스트", () => {
  test("성공하는 테스트, 정상적인 데이터 삭제", async () => {
    // profile이 user를 참조하기 때문에 profile -> user 순서대로 삭제해야함
    await dataSource.manager.clear(Profile);
    await dataSource.manager.clear(User);

    await expect(dataSource.manager.exists(User)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });

  test("성공하는 테스트, user와 profile이 cascade delete 설정이 되어있지 않아 같이 삭제되지 않음", async () => {
    await dataSource.manager.clear(Profile);

    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
  });

  test.failing("실패하는 테스트, 순서대로 데이터를 삭제하지 않음", async () => {
    // QueryFailedError: SQLITE_CONSTRAINT: FOREIGN KEY constraint failedJest
    await dataSource.manager.clear(User);

    await expect(dataSource.manager.exists(User)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
  });
});
