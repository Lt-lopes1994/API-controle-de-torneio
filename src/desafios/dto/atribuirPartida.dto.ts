import { IsNotEmpty } from 'class-validator';
import { Jogador } from 'src/jogadores/interfaces/jogador.inteface';
import { Resultado } from '../interface/desafios.interface';

export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}
