import { createDataSource, initializeDataSource } from "../../../../../../../data-source";
import { Detail } from "./entity/detail.entity";
import { Order } from "./entity/order.entity";
import { Product } from "./entity/product.entity";

const dataSource = createDataSource(__dirname);

beforeAll(async () => {
  await initializeDataSource(dataSource);
});

beforeEach(async () => {
  await dataSource.manager.clear(Detail);
  await dataSource.manager.clear(Product);
  await dataSource.manager.clear(Order);
});

describe("중첩된 양방향 1:1 cascade 저장, 전부 cascade insert설정되어 있으므로 모든 엔티티에서 cascade insert 가능", () => {
  test("성공하는 테스트, order에서 저장", async () => {
    const order = dataSource.manager.create(Order, {
      name: "주문이름",
      product: {
        name: "상품이름",
        detail: {
          detail: "세부사항",
        },
      },
    });
    await dataSource.manager.save(Order, order);

    await expect(dataSource.manager.exists(Order)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Product)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Detail)).resolves.toBe(true);
  });

  test("성공하는 테스트, profile에서 저장", async () => {
    const product = dataSource.manager.create(Product, {
      name: "상품이름",
      order: {
        name: "주문이름",
      },
      detail: {
        detail: "세부사항",
      },
    });
    await dataSource.manager.save(Product, product);

    await expect(dataSource.manager.exists(Order)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Product)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Detail)).resolves.toBe(true);
  });

  test("성공하는 테스트, detail에서 저장", async () => {
    const detail = dataSource.manager.create(Detail, {
      detail: "세부사항",
      product: {
        name: "상품이름",
        order: {
          name: "주문이름",
        },
      },
    });
    await dataSource.manager.save(Detail, detail);

    await expect(dataSource.manager.exists(Order)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Product)).resolves.toBe(true);
    await expect(dataSource.manager.exists(Detail)).resolves.toBe(true);
  });
});
