import { IsNotEmpty, IsString } from 'class-validator';
import { LocationCreateDTO } from './create.dto';

export class UpdateLocationDTO extends LocationCreateDTO {
  @IsString()
  @IsNotEmpty()
  id: string;
}
