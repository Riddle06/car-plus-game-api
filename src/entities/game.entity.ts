import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("game",{schema:"carPlusGame"})
export class game {

    @Column("text",{ 
        nullable:false,
        name:"description"
        })
    description:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:500,
        default:"",
        name:"game_cover_image_url"
        })
    gameCoverImageUrl:string;
        

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:50,
        name:"id"
        })
    id:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        default:"",
        name:"name"
        })
    name:string;
        

    @Column("json",{ 
        nullable:false,
        name:"parameters"
        })
    parameters:Object;
        
}
