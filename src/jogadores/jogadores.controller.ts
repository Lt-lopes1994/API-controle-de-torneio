/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.inteface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) { }

  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    await this.jogadoresService.criarAtulizarJogador(criarJogadorDto);
  }

  @Get()
  async consultarJogadores(@Query('email') email: string): Promise<Jogador | Jogador[]> {
    if (email) {
      return await this.jogadoresService.consultarJogadoresPeloEmail(email);
    }
    return await this.jogadoresService.consultarJogadores();
  }

  @Delete()
  async deletarJogador(@Query('email') email: string): Promise<void> {
    await this.jogadoresService.deletarJogador(email);
  }
}
