import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityCustom } from '../base.entity';
import { PlanQuestionEntity } from './plan-question.entity';

@Entity('master_data_plan_question_options')
export class PlanQuestionOptionEntity extends BaseEntityCustom {
  @ApiProperty({ example: 'Only me', description: 'Label của lựa chọn' })
  @Column({ type: 'varchar', length: 255 })
  label: string;

  @ApiProperty({ example: 'Traveling alone', description: 'Mô tả lựa chọn' })
  @Column({ type: 'text', nullable: true })
  desc?: string;

  @ApiProperty({ example: '🧍', description: 'Biểu tượng cảm xúc' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  icon?: string;

  @ApiProperty({ example: 'only_me', description: 'Giá trị định danh' })
  @Column({ type: 'varchar', length: 100 })
  value: string;

  @ManyToOne(() => PlanQuestionEntity, (question) => question.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: PlanQuestionEntity;

  @Column({ type: 'uuid' })
  questionId: string;
}
