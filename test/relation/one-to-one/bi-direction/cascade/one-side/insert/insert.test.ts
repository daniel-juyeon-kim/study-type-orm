import { createDataSource, initializeDataSource } from "../../../../../../data-source";
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

describe("양방향 1:1이면서 하나의 엔티티에만 cascade인 엔티티들을 저장하는 테스트", () => {
  test("성공하는 테스트", async () => {
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

  test("실패하는 테스트, user엔티티에서 cascade 저장 시도", async () => {
    const user = dataSource.manager.create(User, {
      name: "이름",
      profile: {
        gender: "성별",
        photo: "사진 정보",
      },
    });

    await dataSource.manager.save(User, user);

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    // profile에만 cascade insert가 되어있기 때문에 user에서 cascade 저장을 시도해도 user 데이터만 저장되고 profile은 저장되지 않음
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });
});
