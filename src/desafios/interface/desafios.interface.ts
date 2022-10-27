import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.inteface';

export interface Desafio extends Document {
  dataHoraDesafio: Date;
  status: string;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: Jogador;
  categoria: string;
  jogadores: Array<Jogador>;
  partida: Partida;
}

export interface Partida extends Document {
  categoria: string;
  jogadores: Array<Jogador>;
  def: Jogador;
  resultado: Array<Resultado>;
}

export interface Resultado {
  set: string;
}
