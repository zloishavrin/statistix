import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class QueueMessageDto {
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  taskTitle: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['completed', 'failed'])
  status: 'completed' | 'failed';
}
