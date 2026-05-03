import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { environment } from '@environments/environment.prod';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  public eventos : Evento[] = [];
  public eventoId = 0;
  modalRef!: BsModalRef;
  public pagination = {} as Pagination;

  public widthImg: number = 100;
  public marginImg: number = 2;
  public mostrarImagem: boolean = true;
  private _filtroLista = '';

  termoBusca: Subject<string> = new Subject<string>();


  public get filtroLista(): string{
    return this._filtroLista;
  }

  public set filtroLista(value : string){
    this._filtroLista = value;
  }

  public filtrarEventos(evt : any) : void {
    if(this.termoBusca.observers.length === 0){
    this.termoBusca.pipe(debounceTime(1000)).subscribe(
      filtrarPor => {
        this.spinner.show();
        this.eventoService
       .getEvento(this.pagination.currentPage, 
                  this.pagination.itemsPerPage, 
                  filtrarPor)
                  .subscribe(
                    (PaginatedResult: PaginatedResult<Evento[]>) => {
                      this.eventos = PaginatedResult.result;
                      this.pagination = PaginatedResult.pagination;
                      evt.value
                    },
                    (error: any) => {
                      this.spinner.hide();
                      this.toastr.error('Erro ao filtrar os eventos', 'Erro!');
                    }
                  ).add(() => this.spinner.hide())
      })
    }
    this.termoBusca.next(evt.value);}

  constructor(private eventoService: EventoService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router
  ) { }

 public ngOnInit(): void {
  this.pagination = {currentPage : 1, itemsPerPage : 3, totalItems : 1} as Pagination;
  this.carregarEventos();
  }

    public alterarImagem(): void{
    this.mostrarImagem = !this.mostrarImagem;
  };

    public carregarEventos(): void{
      this.spinner.show();
      this.eventoService.getEvento(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
        (response: PaginatedResult<Evento[]>) => {
          this.eventos = response.result;
          this.pagination = response.pagination;
        },
          (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os eventos', 'Erro!');
        },
      ).add(() => this.spinner.hide());
    }
    
openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
  event.stopPropagation();
  this.eventoId = eventoId;
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}
confirm(): void {
  this.modalRef.hide();
  this.spinner.show();

  this.eventoService.deleteEvento(this.eventoId).subscribe(
    (result: any) => {
      if (result.message === 'Deletado') {
        this.toastr.success('Evento deletado com sucesso!', 'Deletado!');
        this.spinner.hide();
        this.carregarEventos();
    }
  },
    (error: any) => {
      this.toastr.error(`Erro ao deletar o evento ${this.eventoId}`, 'Erro!');
      this.spinner.hide();
      console.error(error);
    },
    () => this.spinner.hide(),
  );
}
decline(): void {
  this.modalRef.hide();
}

detalheEvento(eventoId: number): void {
  this.router.navigate([`eventos/detalhe/${eventoId}`]);
}

public mostraImagem(imagemURL: string): string {
  return (imagemURL !== '' && imagemURL !== null) 
  ? `${environment.apiUrl}resources/images/${imagemURL}` 
  : 'assets/semImagem.png';
}

public pageChanged(event: any): void {
  this.pagination.currentPage = event.page;
  this.carregarEventos();
}

}