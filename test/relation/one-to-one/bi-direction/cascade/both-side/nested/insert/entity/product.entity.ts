import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Detail } from "./detail.entity";
import { Order } from "./order.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => Order, (order) => order.product, {
    cascade: ["insert"],
  })
  @JoinColumn()
  order!: Order;

  @OneToOne(() => Detail, (detail) => detail.product, {
    cascade: ["insert"],
  })
  detail!: Detail;
}
