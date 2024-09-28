import { createDataSource, initializeDataSource } from "../../../../../data-source";
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
  await dataSource.manager.clear(User);
});

describe("단방향 1:1 cascade onDelete 삭제 테스트", () => {
  test("성공하는 테스트, 참조당하는 엔티티를 삭제되면 참조하는 엔티티도 같이 삭제됨", async () => {
    await dataSource.manager.clear(User);

    await expect(dataSource.manager.exists(User)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });

  test("실패하는 테스트, 참조하는 엔티티를 제거하면 참조 당하는 엔티티는 삭제되지 않음", async () => {
    // onDelete 옵션은 참조하는 데이터가 삭제되면 행동할 옵션이므로 user가 삭제되면 profile도 같이 삭제됨
    await dataSource.manager.clear(Profile);

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });
});
