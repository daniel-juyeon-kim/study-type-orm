import { createDataSource, initializeDataSource } from "../../../../../data-source";
import { Profile } from "./entity/profile.entity";
import { User } from "./entity/user.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

afterEach(async () => {
  await dataSource.manager.clear(Profile);
  await dataSource.manager.clear(User);
});

describe("단방향 1:1 cascade 저장", () => {
  test("성공하는 테스트", async () => {
    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
      user: {
        name: "이름",
      },
    });

    await dataSource.manager.save(Profile, profile);

    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
  });

  test("실패하는 테스트, user엔티티에 cascade 설정이 되어있지 않음", async () => {
    // user엔티티는 joinColumn, OneToOne 데코레이터가 없고 cascade 설정이 되어있지 않기 때문에 cascade으로 저장되지 않음
    const user = dataSource.manager.create(User, {
      name: "이름",
      profile: {
        gender: "성별",
        photo: "사진 정보",
      },
    });

    await dataSource.manager.save(User, user);

    // cascade로 저장되지 않아서 profile은 저장되지 않음
    await expect(dataSource.manager.exists(User)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Profile)).resolves.toBe(false);
  });

  test("cascade를 설정이 강제가 아니기 때문에 하나의 엔티티만 저장하는 것도 가능함", async () => {
    const profile = dataSource.manager.create(Profile, {
      gender: "성별",
      photo: "사진 정보",
    });

    await dataSource.manager.save(Profile, profile);

    await expect(dataSource.manager.exists(Profile)).resolves.toBe(true);
    await expect(dataSource.manager.exists(User)).resolves.toBe(false);
  });
});
