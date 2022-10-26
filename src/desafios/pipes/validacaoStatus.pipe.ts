import { PipeTransform, BadRequestException } from '@nestjs/common';
import { DesafioStatus } from '../interface/desafioStatus.enum';

export class desafioStatusPipe implements PipeTransform {
  readonly statusPermitidos = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.ehStatusValido(status)) {
      throw new BadRequestException(`${status} não é um status válido`);
    }

    return value;
  }

  private ehStatusValido(status: any) {
    const idx = this.statusPermitidos.indexOf(status);
    return idx !== -1;
  }
}
