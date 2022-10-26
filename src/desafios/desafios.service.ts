import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirDesafioPartidaDto } from './dto/atribuirPartida.dto';
import { AtualizarDesafioDto } from './dto/atualizarDesafio.dto';
import { CriarDesafioDto } from './dto/criarDesafio.dto';
import { Desafio, Partida } from './interface/desafios.interface';
import { DesafioStatus } from './interface/desafioStatus.enum';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriaService: CategoriasService,

    private readonly logger = new Logger(DesafiosService.name),
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const jogadores = await this.jogadoresService.consultarJogadores();

    criarDesafioDto.jogadores.map((jogadorDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => jogador._id == jogadorDto._id,
      );

      if (jogadorFilter.length === 0) {
        throw new BadRequestException(
          `O ID ${jogadorDto.id} não e um jogador.`,
        );
      }
    });

    const solicitanteEhJogadorNaPartida = criarDesafioDto.jogadores.filter(
      (jogador) => jogador._id === criarDesafioDto.solicitante,
    );

    this.logger.log(`Solicitante da partida: ${solicitanteEhJogadorNaPartida}`);

    if (solicitanteEhJogadorNaPartida.length === 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida`,
      );
    }

    const categoriaDoJogador =
      await this.categoriaService.consultarCategoriaDoJogador(
        criarDesafioDto.solicitante,
      );

    this.logger.log(`Categoria do jogador: ${categoriaDoJogador}`);

    if (!categoriaDoJogador) {
      throw new BadRequestException(
        `O jogador de id ${criarDesafioDto.solicitante} não está associado a uma categoria. Insira uma categoria para o jogador e tente novamente.`,
      );
    }

    const desafioCriado = new this.desafioModel(criarDesafioDto);

    desafioCriado.categoria = categoriaDoJogador.categoria;
    desafioCriado.dataHoraDesafio = new Date();
    desafioCriado.status = DesafioStatus.PENDENTE;
    this.logger.log(
      `Desafio criado com sucesso: ${JSON.stringify(desafioCriado)}`,
    );
    return await desafioCriado.save();
  }

  async consultarDesafios(): Promise<Array<Desafio>> {
    return await this.desafioModel
      .find()
      .populate('jogadores')
      .populate('solicitante')
      .populate('partida')
      .exec();
  }

  async consultarDesafioDeUmJogador(_id: any): Promise<Array<Desafio>> {
    const jogadores = await this.jogadoresService.consultarJogadores();

    const filtroJogadores = jogadores.filter((jogador) => jogador._id == _id);

    if (filtroJogadores.length === 0) {
      throw new BadRequestException(`O ID ${_id} não e um jogador.`);
    }

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in(_id)
      .populate('jogadores')
      .populate('solicitante')
      .populate('partida')
      .exec();
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findOne({ _id }).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`O desafio ${_id} não foi encontrado.`);
    }

    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraDesafio = new Date();
    }
    desafioEncontrado.status = atualizarDesafioDto.status;
    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async atribuirDesafioPartida(
    _id: string,
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`O desafio ${_id} não foi encontrado.`);
    }

    const filtroDeJogadores = desafioEncontrado.jogadores.filter(
      (jogador) => jogador._id == atribuirDesafioPartidaDto.def,
    );

    this.logger.log(`Filtro de jogadores: ${filtroDeJogadores}`);
    this.logger.log(`Jogadores: ${filtroDeJogadores}`);

    if (filtroDeJogadores.length == 0) {
      throw new BadRequestException(`O jogador não está no desafio.`);
    }

    const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);
    partidaCriada.categoria = desafioEncontrado.categoria;
    partidaCriada.jogadores = desafioEncontrado.jogadores;

    const resultado = await partidaCriada.save();

    desafioEncontrado.status = DesafioStatus.REALIZADO;
    desafioEncontrado.partida = resultado._id;

    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch (error) {
      await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deletarDesafio(_id: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findOne({ _id }).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`O desafio ${_id} não foi encontrado.`);
    }

    desafioEncontrado.status = DesafioStatus.CANCELADO;

    await this.desafioModel
      .findByIdAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }
}
