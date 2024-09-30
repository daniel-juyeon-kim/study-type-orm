import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { A } from "./a.entity";
import { E } from "./e.entity";

@Entity()
export class D {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => A, (a) => a.d, {
    cascade: ["insert"],
    onDelete: "CASCADE",
  })
  @JoinColumn()
  a!: A;

  @OneToOne(() => E, (e) => e.d, {
    cascade: ["insert"],
  })
  e!: E;
}
