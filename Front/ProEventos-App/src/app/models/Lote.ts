import { Evento } from "./Evento.js";

export interface Lote {    
        
 id: number;
 nome: string;
 preco: number;
 datainicio?: Date;
 datafim?: Date;
 quantidade: number;
 eventoid: number;
 evento: Evento;
};
