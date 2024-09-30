import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { A } from "./a.entity";

@Entity()
export class D {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => A, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  a!: A;
}
