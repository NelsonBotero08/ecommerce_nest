import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text', {
        unique: true  // de esta manera se puede definir que el titulo se aunico no pueden haber 2 iguales
    })
    title: string;


    @Column('float',{
        default: 0
    })
    price: number


    @Column({
        type: 'text',
        nullable: true   // esto quiere decir que puede aceptar nulo
    })
    description: string


    @Column('text', {
        unique: true
    })
    slug: string;


    @Column('int',{
        default: 0
    })
    stock: number


    @Column('text',{
        array: true
    })
    sizes: string[]


    @Column('text')
    gender: string


    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]


    // images

    @BeforeInsert()
    checkSlugInsert() {

        if (!this.slug){
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }

    @BeforeUpdate()
    checkSlugUpdate() {

        if (this.slug){
            this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
        }

    }

}
