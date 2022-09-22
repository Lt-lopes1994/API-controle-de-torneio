/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { AtualizarJogadorDto } from './dto/atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.inteface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametorsPipe } from './pipes/jogadores-validacao-parametors.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadoresService.criarJogador(criarJogadorDto);
  }


  @Put(`/:_id`)
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param(`_id`, JogadoresValidacaoParametorsPipe) _id: string,): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDto);
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {

    return await this.jogadoresService.consultarJogadores();

  }

  @Get(`/:_id`)
  async consultarJogadorePorId(@Param('_id', JogadoresValidacaoParametorsPipe) _id: string): Promise<Jogador> {

    return await this.jogadoresService.consultarJogadoresPeloId(_id);

  }


  @Delete(`/:_id`)
  async deletarJogador(
    @Param(`_id`, JogadoresValidacaoParametorsPipe) _id: string): Promise<void> {
    await this.jogadoresService.deletarJogador(_id);
  }
}
