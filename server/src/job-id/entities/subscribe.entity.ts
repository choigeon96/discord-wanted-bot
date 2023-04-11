import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscribe {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 20 })
  keyword: string;
  @Column({ type: 'varchar', length: 20 })
  subscriber: string;
}
