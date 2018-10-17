import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("game_question",{schema:"carPlusGame"})
export class game_question {

    @Column("text",{ 
        nullable:false,
        name:"answer"
        })
    answer:string;
        

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:50,
        name:"id"
        })
    id:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:500,
        default:"",
        name:"question"
        })
    question:string;
        

    @Column("int",{ 
        nullable:false,
        default:"0",
        name:"sort"
        })
    sort:number;
        
}
