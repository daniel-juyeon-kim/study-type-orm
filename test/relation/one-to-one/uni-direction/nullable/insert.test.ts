import { createDataSource, initializeDataSource } from "../../../../data-source";
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

/**
 * one to one 관계에서 옵션으로 nullable: false이면 해당 엔티티를 저장하기 위해서는 참조하는 엔티티와 같이 저정해야함
 */

describe("단방향 1:1 not null 저장", () => {
  test("성공하는 단방향 1:1 not null 저장", async () => {
    // QueryFailedError: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed fk가 문제 있음 그러면 profile을 먼저
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

  test.skip.failing(
    "실패하는 1:1 not null 저장, SQLITE_CONSTRAINT: NOT NULL constraint failed: profile.userId",
    async () => {
      const user = dataSource.manager.create(User, {
        name: "이름",
      });

      await dataSource.manager.save(User, user);

      const profile = dataSource.manager.create(Profile, {
        gender: "성별",
        photo: "사진 정보",
      });

      await dataSource.manager.save(Profile, profile);
    },
  );
});
