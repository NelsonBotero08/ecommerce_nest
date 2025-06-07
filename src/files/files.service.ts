import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';



@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {

    console.log("get", imageName)

    const path = join( __dirname, '../../static/products', imageName)

    console.log("path", path)

    if (!existsSync(path)) {
      throw new BadRequestException(
        `Not product found with image ${imageName}`,
      );
    }

    return path;
  }
}
