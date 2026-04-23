import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  modalRef: BsModalRef;
  eventoId : number;
  form: FormGroup;
  evento = {} as Evento;
  estadoSalvar = 'post';
  loteAtual = {id: 0, nome: '', index: 0};
  imagemURL = '/assets/upload.png';
  file!: FileList;
  
  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }
  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };   
  }
  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private activatedRouter: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private router: Router,
              private modalService: BsModalService,
              private loteService: LoteService,
  )           { this.localeService.use('pt-br'); }

  public CarregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id')!;

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          if (this.evento.imagemURL !== '' && this.evento.imagemURL !== null) {
            this.imagemURL = environment.apiUrl + 'resources/images/' + this.evento.imagemURL;
          }
          this.evento.lotes.forEach(lote => this.lotes.push(this.criarLote(lote)));
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar evento', 'Erro');
        },
        () => this.spinner.hide()
    )}
  }

  ngOnInit(): void {
this.validation();
this.CarregarEvento();
}
public validation(): void {

  this.form = this.fb.group({
    tema : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    local : ['', Validators.required],
    dataEvento : ['', Validators.required],
    qtdPessoas : ['', [Validators.required, Validators.max(120000)]],
    //imagemURL : ['', Validators.required],
    telefone : ['', Validators.required],
    email : ['', [Validators.required, Validators.email]],
    lotes : this.fb.array([]),
  });
}
adicionarLote(): void {
  this.lotes.push(
    this.criarLote({id : 0} as Lote)
  );
}

criarLote(lote: Lote): FormGroup {
  return this.fb.group({
      id : [lote.id],
      nome : [lote.nome, Validators.required],
      quantidade : [lote.quantidade, Validators.required],
      preco : [lote.preco, Validators.required],
      dataInicio : [lote.dataInicio,],
      dataFim : [lote.dataFim,],
});
}

public mudarValorData(value: Date, index: number, campo: string): void {
  this.lotes.value[index][campo] = value;
}

public retornaTituloLote(nome: string): string {
  return nome === null || nome === '' ? 'Nome do Lote' : nome;
}

public resetForm(): void {
  this.form.reset(); 
}

public cssValidator(campoForm: FormControl | AbstractControl): any {
  return {'is-invalid': campoForm.errors && campoForm.touched};
}

public salvarEvento(): void {
  this.spinner.show();
  if (this.form.valid) {

     this.evento = (this.estadoSalvar === 'post')
      ? { ...this.form.value }
      : { eventoId: this.evento.eventoId, ...this.form.value };

      this.eventoService[this.estadoSalvar as 'post' | 'put'](this.evento).subscribe(
      (eventoRetorno : Evento) => {
          this.toastr.success('Evento salvo com sucesso', 'Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.eventoId}`]);
      },
        
      (error: any) => {
        console.error(error);
        this.toastr.error('Erro ao salvar evento', 'Erro');
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }
  }

  public salvarLotes(): void {
    if (this.form.controls.lotes.valid) {
    this.spinner.show();
    if (this.form.controls.lotes.valid) {
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
      .subscribe(
        () => {
          this.toastr.success('Lotes salvos com sucesso', 'Sucesso');
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar salvar lotes', 'Erro');
          console.error(error);
        }
    ).add(() => this.spinner.hide());
    }
  }
}

public removerLote( template: TemplateRef<any>, 
                    index: number): void {

  this.loteAtual.id = this.lotes.get(index + '.id')?.value;
  this.loteAtual.nome = this.lotes.get(index + '.nome')?.value;
  this.loteAtual.index = index;

  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  //this.lotes.removeAt(index);
}
public confirmDeleteLote(): void {
  this.modalRef.hide();
  this.spinner.show();
  this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
    .subscribe(
      () => {
        this.toastr.success('Lote excluído com sucesso', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.index);
      },
      (error : any) => {
        this.toastr.error(`Erro ao tentar excluir lote ${this.loteAtual.id}`, 'Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
}
public declineDeleteLote(): void {
  this.modalRef.hide();
}

onFileChange(ev: any): void {

const reader = new FileReader();
reader.onload = (event: any) => this.imagemURL = event.target.result;
this.file = ev.target.files;
reader.readAsDataURL(this.file.item(0) as File);
this.uploadImagem();

}

public uploadImagem(): void {
this.spinner.show();
this.eventoService.postUpload(this.eventoId, this.file).subscribe(
  () => {
    this.CarregarEvento();
    this.toastr.success('Imagem atualizada com sucesso', 'Sucesso');
  },
  (error : any) => {
    this.toastr.error('Erro ao tentar atualizar imagem', 'Erro');
  }
).add(() => this.spinner.hide());
}
}
