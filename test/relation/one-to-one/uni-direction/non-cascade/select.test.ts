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
  await createUserAndProfile();
});

describe("단방향 1:1 조회 테스트", () => {
  test("성공하는 테스트, profile에서 join으로 데이터를 통합해 조회 가능함", async () => {
    const profile = await dataSource.manager.findOne(Profile, {
      relations: { user: true },
      where: { photo: "사진 정보" },
    });

    expect(profile).toEqual({
      id: 1,
      gender: "성별",
      photo: "사진 정보",
      user: { id: 1, name: "이름" },
    });
  });

  test.skip.failing(
    "실패하는 테스트, 한 방향에서만 join가능하므로 다른 방향에서 join 불가(타입 에러 발생함)",
    async () => {
      await dataSource.manager.findOne(User, {
        relations: { profile: true },
        where: { name: "이름" },
      });
    },
  );
});
