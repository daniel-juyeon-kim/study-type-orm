import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { B } from "./b.entity";
import { D } from "./d.entity";

@Entity()
export class A {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => B, (b) => b.a)
  b!: B;

  @OneToOne(() => D, (d) => d.a)
  d!: D;
}
