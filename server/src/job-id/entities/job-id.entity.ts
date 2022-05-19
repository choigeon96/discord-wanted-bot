import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JobId {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 20 })
  jobId: string;
}
