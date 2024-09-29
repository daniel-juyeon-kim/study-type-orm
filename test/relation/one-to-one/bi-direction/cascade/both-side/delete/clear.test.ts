import { createDataSource, initializeDataSource } from "../../../../../../data-source";
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
    user: user,
  });

  await dataSource.manager.save(Profile, profile);
};

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await dataSource.manager.clear(User);
  await dataSource.manager.clear(Profile);
});

describe("양방향 1:1 cascade onDelete 삭제 테스트", () => {
  beforeEach(async () => {
    await createUserAndProfile();
  });

  test("성공하는 테스트, profile이 user를 참조하므로 user가 삭제되면 profile도 같이 삭제됨", async () => {
    await dataSource.manager.clear(User);

    await expect(dataSource.manager.exists(User)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });

  test("실패하는 테스트, user도 cascade설정이 되어있기 때문에 profile 삭제시 user도 같이 삭제되어야 하지만 삭제되지 않음", async () => {
    await dataSource.manager.clear(Profile);
    // 결국 joinColumn이 있는 곳에 onDelete 했을때와 결과가 같음, 이 옵션은 양방향으로 설정해도 의미가 없는듯 함

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });
});
