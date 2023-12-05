import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users-task')
export class User {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: true,
    type: 'timestamp',
    name: 'updated_at',
  })
  updated_at: Date;

  @DeleteDateColumn({
    nullable: true,
    type: 'timestamp',
    name: 'deleted_at',
  })
  deleted_at: Date;
  
}
