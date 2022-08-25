/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.inteface';

@Injectable()
export class JogadoresService {

  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtulizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criaJogadorDto;

    const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email);

    if (jogadorEncontrado) {
      await this.atualizarJogador(jogadorEncontrado, criaJogadorDto);
    } else {
      await this.criar(criaJogadorDto);
    }



  };

  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async deletarJogador(email: string): Promise<void> {
    const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email);

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com ${email} não encontrado`);
    }

    this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontrado.email);
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email);

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com ${email} não encontrado`);
    }
    return jogadorEncontrado;
  }

  private criar(criaJogadorDto: CriarJogadorDto): void {
    const { name, email, phoneNumber } = criaJogadorDto;

    const jogador: Jogador = {
      id: this.jogadores.length + 1,
      name,
      email,
      phoneNumber,
      ranking: 'A',
      rakingPosition: 1,
      urlProfilePic: 'www.google.com.br/foto123.jpg',
    };
    this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`)

    this.jogadores.push(jogador);
  }

  private atualizarJogador(jogadorEncontrado: Jogador, criaJogadorDto: CriarJogadorDto): void {
    const { name } = criaJogadorDto;

    jogadorEncontrado.name = name;
  }
}
