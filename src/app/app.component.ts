import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
interface Question { id: string; text: string; area: 'Conteúdo'|'Dados'|'Links'; }
const QUESTIONS: Question[] = [
{id:'subject',text:'Assunto e pré-header revisados?',area:'Conteúdo'},
{id:'personalization',text:'Campos dinâmicos e personalização conferidos?',area:'Conteúdo'},
{id:'segment',text:'Público e critérios de segmentação validados?',area:'Dados'},
{id:'duplicates',text:'Contatos duplicados e exclusões conferidos?',area:'Dados'},
{id:'links',text:'Links e UTMs testados?',area:'Links'},
{id:'mobile',text:'Conteúdo revisado em dispositivo móvel?',area:'Links'}];
@Component({selector:'app-root',standalone:true,imports:[ReactiveFormsModule],templateUrl:'./app.component.html'})
export class AppComponent {
  readonly questions = QUESTIONS;
  readonly form = new FormBuilder().nonNullable.group({campaign:['',[Validators.required,Validators.minLength(3)]],channel:['Email',Validators.required],owner:['',Validators.required]});
  readonly checked = signal<string[]>([]);
  readonly progress = computed(() => Math.round(this.checked().length / QUESTIONS.length * 100));
  readonly report = signal('');
  setChecked(id:string,yes:boolean):void {this.checked.update(list=>yes?[...list.filter(x=>x!==id),id]:list.filter(x=>x!==id));this.report.set('');}
  generate():void {if(this.form.invalid){this.form.markAllAsTouched();return;}
    const value=this.form.getRawValue(); const pending=QUESTIONS.filter(q=>!this.checked().includes(q.id));
    this.report.set(`Campanha: ${value.campaign}
Canal: ${value.channel}
Responsável: ${value.owner}
Conclusão: ${this.progress()}%
Pendências:
${pending.length?pending.map(q=>'• '+q.text).join('\n'):'Nenhuma pendência.'}`);
  }
  reset():void {this.form.reset({campaign:'',channel:'Email',owner:''});this.checked.set([]);this.report.set('');}
}
