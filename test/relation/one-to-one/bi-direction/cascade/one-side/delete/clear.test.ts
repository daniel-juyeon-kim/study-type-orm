import { createDataSource, initializeDataSource } from "../../../../../../data-source";
import { Profile } from "./entity/profile.entity";
import { User } from "./entity/user.entity";

const createUserAndProfile = async () => {
  const profile = dataSource.manager.create(Profile, {
    gender: "성별",
    photo: "사진 정보",
  });

  await dataSource.manager.save(Profile, profile);

  const user = dataSource.manager.create(User, {
    name: "이름",
    profile: profile,
  });

  await dataSource.manager.save(User, user);
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

// NOTE: onDelete: "RESTRICT"|"CASCADE"|"SET NULL" 참조되는 엔티티가 제거될때 해야 할 동작을 의미
// 참조를 하는 엔티티에 JoinColumn과 해당 속성이 있어야 함

describe("양방향 1:1 하나의 엔티티에만 cascade인 엔티티에서 삭제 테스트", () => {
  test("성공하는 테스트, profile은 user를 참조하고 있기 때문에 user를 삭제하면 연결된 profile도 삭제됨", async () => {
    await dataSource.manager.clear(User);

    await expect(dataSource.manager.exists(User)).resolves.toBe(false);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });

  test("실패하는 테스트, profile은 user를 참조하고 있기 때문에 삭제되도 상관은 없지만 user와 같이 삭제되지는 않음", async () => {
    await dataSource.manager.clear(Profile);

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });
});
