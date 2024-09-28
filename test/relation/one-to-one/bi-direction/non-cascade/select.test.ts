import { createDataSource, initializeDataSource } from "../../../../data-source";
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
    profile,
  });

  await dataSource.manager.save(User, user);
};

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
  await createUserAndProfile();
});

describe("양방향 1:1 조회 테스트", () => {
  test("성공하는 테스트, user에서 조회", async () => {
    const user = await dataSource.manager.findOne(User, {
      relations: { profile: true },
      where: { name: "이름" },
    });

    expect(user).toBeTruthy();
    expect(user?.profile).toBeTruthy();
  });

  test("성공하는 테스트, profile에서 조회", async () => {
    const profile = await dataSource.manager.findOne(Profile, {
      relations: { user: true },
      where: { id: 1 },
    });

    expect(profile).toBeTruthy();
    expect(profile?.user).toBeTruthy();
  });
});
