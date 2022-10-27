import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtribuirDesafioPartidaDto } from './dto/atribuirPartida.dto';
import { AtualizarDesafioDto } from './dto/atualizarDesafio.dto';
import { CriarDesafioDto } from './dto/criarDesafio.dto';
import { Desafio } from './interface/desafios.interface';
import { DesafioStatusPipe } from './pipes/validacaoStatus.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafioService: DesafiosService) {}
  private readonly logger = new Logger(DesafiosController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    this.logger.log(`Criar desafio: ${JSON.stringify(criarDesafioDto)}`);
    return await this.desafioService.criarDesafio(criarDesafioDto);
  }

  @Get()
  async consultarDesafios(
    @Query('idJogador') _id: string,
  ): Promise<Array<Desafio>> {
    return _id
      ? await this.desafioService.consultarDesafioDeUmJogador(_id)
      : await this.desafioService.consultarDesafios();
  }

  @Put('/:desafio')
  async atualizarDesafio(
    @Body(DesafioStatusPipe) atualizarDesafioDto: AtualizarDesafioDto,
    @Param('desafio') _id: string,
  ): Promise<void> {
    await this.desafioService.atualizarDesafio(_id, atualizarDesafioDto);
  }

  @Post('/:desafio/partida')
  async atribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param('desafio') _id: string,
  ): Promise<void> {
    return await this.desafioService.atribuirDesafioPartida(
      _id,
      atribuirDesafioPartidaDto,
    );
  }

  @Delete('/:_id')
  async deletarDesafio(@Param('_id') _id: string): Promise<void> {
    this.logger.log(`Deletar desafio: ${_id}`);
    await this.desafioService.deletarDesafio(_id);
  }
}
