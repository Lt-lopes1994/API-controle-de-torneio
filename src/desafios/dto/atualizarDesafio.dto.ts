import { IsOptional } from 'class-validator';
import { DesafioStatus } from '../interface/desafioStatus.enum';

export class AtualizarDesafioDto {
  @IsOptional()
  dataHoraDesafio: Date;

  @IsOptional()
  status: DesafioStatus;
}
