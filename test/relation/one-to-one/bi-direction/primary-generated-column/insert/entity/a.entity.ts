import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { B } from "./b.entity";

@Entity()
export class A {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => B, (b) => b.a)
  b!: B;
}
