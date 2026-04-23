import { ValidatorField } from './../../../helpers/ValidatorField';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserUpdate} from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.validation();
    this.carregrarUsuario();
  }

  private carregrarUsuario(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userReturn: UserUpdate) => {
        console.log(userReturn);
        this.userUpdate = userReturn;
        this.form.patchValue(this.userUpdate);
        this.toastr.success('Usuário carregado com Sucesso!', 'Sucesso!');
      },
      (error) => {
        console.error(error);
        this.toastr.error('Erro ao carregar usuário', 'Erro!');
        this.router.navigate(['/dashboard']);
      }
    ).add(() => this.spinner.hide());
  }

  private validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword')
    };

    this.form = this.fb.group({
      username: [''],
      titulo: ['NaoInformado', Validators.required],
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      descricao: ['', Validators.required],
      funcao: ['NaoInformado', Validators.required],
      password: ['', [Validators.minLength(4), Validators.nullValidator]],
      confirmePassword: ['', Validators.nullValidator]
    }, formOptions);
  }

  // Conveniente para pegar um FormField apenas com a letra F
  get f(): any { return this.form.controls; }

  onSubmit(): void {
    this.atualizarUsuario();
    }
  
  public atualizarUsuario(): void {
    this.userUpdate = { ...this.form.value };
    this.spinner.show();
    this.accountService.updateUser(this.userUpdate).subscribe(
      () => {
        this.toastr.success('Usuário atualizado com Sucesso!', 'Sucesso!');
      },
      (error) => {
        console.error(error);
        this.toastr.error('Erro ao atualizar usuário', 'Erro!');
      }
    ).add(() => this.spinner.hide());
  }
  

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}