import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { A } from "./a.entity";
import { C } from "./c.entity";

@Entity()
export class B {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => A, (a) => a.b, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  a!: A;

  @OneToOne(() => C, (c) => c.b)
  c!: C;
}
