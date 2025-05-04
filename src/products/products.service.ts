import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { title } from 'process';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ){}


  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product)

      return {
        created: 'OK',
        message: 'Producto creado con exito',
        product
      }
      
    } catch (error) {

      this.handleDBException(error)
    }

  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto
    
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(term);

    let product: Product | null;

  if (isUUID) {
    product = await this.productRepository.findOneBy({ id: term });
  } else {
    const queryBuild = this.productRepository.createQueryBuilder('product');

    product = await queryBuild
      .where(`LOWER(product.title) = LOWER(:term) OR LOWER(product.slug) = LOWER(:term)`, {
        term,
      })
      .getOne();
      }

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {

      const product = await this.productRepository.preload({
        id: id,
        ... updateProductDto
      })

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      await this.productRepository.save(product)
      return product;

    } catch (error) {
      this.handleDBException(error)
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id)
    return await this.productRepository.remove(product);
  }


  private handleDBException( error:any ){

    if(error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpectes error, chsck server logs')

  }
  
}
