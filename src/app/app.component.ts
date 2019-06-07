import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { Apollo } from 'apollo-angular';
import * as Query from './query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'encuestas';
 
  preguntas : any = []
  encuestas: any = []

  preguntasEdit: any = []
  respuestasEdit: any = []
  encuestaEdit: any

  tipos = [ 'Pregunta Abierta', 'Opcion Multiple'];

  question
  questionEdit

  nueva = false;
  editar = false;
  ver = false;
  editEncuesta = false;
  editarPregunta = true;

  formRespuestas: FormGroup
  formEditEncuesta : FormGroup
  
  idPregunta = 0
  contadorEncuestas = 0;
  contadorPreguntas = 10;
  contador
  opcionMultiple = false 

  
  

  constructor( 
    private formbuilder: FormBuilder, 
    private apollo: Apollo, 
    ){
    this.formRespuestas = this.formbuilder.group({
      'nombre' : '',
      'pregunta' : '',
      'descripcion': '',
      'select': '',
      'respuesta1' : '',
      'respuesta2' : '',
      'respuesta3' : '',
      'respuesta4' : '',
      'respuesta5' : '',
    })

    this.formEditEncuesta = this.formbuilder.group({
      'nombre' : '',
      'pregunta' : '',
      'descripcion': '',
      'select': '',
      'respuesta1' : '',
      'respuesta2' : '',
      'respuesta3' : '',
      'respuesta4' : '',
      'respuesta5' : '',
    })
    this.getEncuestas()
  }

  


  selected(event: any){
   let seleccionado = event.target.value
   if(seleccionado == "Pregunta Abierta" ){   
      this.opcionMultiple = false
    }else if(seleccionado == "Opcion Multiple"){
      this.opcionMultiple = true
    }
  }

  newEncuesta(){
    this.nueva = true;
  }

  cancelEncuesta(){
    this.nueva = false;
  }

  newPregunta(){
    
    let pregunta = {
      'id' : this.idPregunta,
      'pregunta': this.formRespuestas.get('pregunta').value,
      'tipo' : this.formRespuestas.get('select').value,
      'respuesta1' : this.formRespuestas.get('respuesta1').value,
      'respuesta2' : this.formRespuestas.get('respuesta2').value,
      'respuesta3' : this.formRespuestas.get('respuesta3').value,
      'respuesta4' : this.formRespuestas.get('respuesta4').value,
      'respuesta5' : this.formRespuestas.get('respuesta5').value
    }
    console.log(pregunta)
    this.preguntas.push(pregunta)
    console.log(this.preguntas)

    
    this.formRespuestas.get('pregunta').setValue('')
    this.formRespuestas.get('select').setValue('Pregunta Abierta')
    if(this.opcionMultiple){
      this.opcionMultiple = false
    }
    this.formRespuestas.get('respuesta1').setValue('')
    this.formRespuestas.get('respuesta2').setValue('')
    this.formRespuestas.get('respuesta3').setValue('')
    this.formRespuestas.get('respuesta4').setValue('')
    this.formRespuestas.get('respuesta5').setValue('')
    this.contadorPreguntas --;
    this.idPregunta ++;
  }

  comprobacionRespuestas(): string{
    let data = ""
    if(this.formRespuestas.get('select').value == "Pregunta Abierta"){
      data = ""
    }else{
      if(this.formRespuestas.get('respuesta1').value != ""){
        data = data + this.formRespuestas.get('respuesta1').value
      }
      if(this.formRespuestas.get('respuesta2').value != ""){
        data = data + this.formRespuestas.get('respuesta2').value
      }
      if(this.formRespuestas.get('respuesta3').value != ""){
        data = data + this.formRespuestas.get('respuesta3').value
      }
      if(this.formRespuestas.get('respuesta4').value != ""){
        data = data + this.formRespuestas.get('respuesta4').value
      }
      if(this.formRespuestas.get('respuesta5').value != ""){
        data = data + this.formRespuestas.get('respuesta5').value
      }
    }
    return data
  }

  editPregunta(pregunta: any){
    this.editarPregunta = true
    console.log(pregunta.tipo)
    this.question = pregunta
    console.log(this.question.tipo)
    this.formRespuestas.get('pregunta').setValue(pregunta.pregunta)
    this.formRespuestas.get('select').setValue(pregunta.tipo)
    if(pregunta.tipo == "Pregunta Abierta"){
      this.opcionMultiple = false
    }else if (pregunta.tipo == "Opcion Multiple"){
      this.opcionMultiple = true
    }
    this.formRespuestas.get('respuesta1').setValue(pregunta.respuesta1)
    this.formRespuestas.get('respuesta2').setValue(pregunta.respuesta2)
    this.formRespuestas.get('respuesta3').setValue(pregunta.respuesta3)
    this.formRespuestas.get('respuesta4').setValue(pregunta.respuesta4)
    this.formRespuestas.get('respuesta5').setValue(pregunta.respuesta5)
    this.editar = true;
  }

  updatePregunta(){
    console.log("Antes", this.preguntas)
    this.preguntas.splice(this.question.id, 1, this.formRespuestas.value)
    console.log("Despues", this.preguntas)
    this.preguntasEdit = this.preguntas
    this.formRespuestas.get('pregunta').setValue('')
    this.formRespuestas.get('select').setValue(this.question.tipo)
    console.log("prueba",this.formRespuestas.get('respuesta1').value) 
    this.formRespuestas.get('respuesta1').setValue('')
    this.formRespuestas.get('respuesta2').setValue('')
    this.formRespuestas.get('respuesta3').setValue('')
    this.formRespuestas.get('respuesta4').setValue('')
    this.formRespuestas.get('respuesta5').setValue('')
    this.editar = false;
    
    this.editarPregunta = true;
    if(this.question.tipo == "Pregunta Abierta"){
      this.opcionMultiple = false
    }else if (this.question.tipo == "Opcion Multiple"){
      this.opcionMultiple = true
    }
  }



  guardarComoBorrador(){
    this.newPregunta()
    let encuesta = {
      'encuesta' : this.preguntas,
      'estado' : "borrador",
      'nombre' : this.formRespuestas.get('nombre').value,
      'descripcion' : this.formRespuestas.get('descripcion').value
    }
    this.insertEncuesta(encuesta)
    this.cancelEncuesta()
    console.log(this.encuestas)
    this.idPregunta = 0;
    this.contadorPreguntas = 0;
  }

  getEncuestas(){
    this.apollo.watchQuery({query: Query.Encuestas }).valueChanges.subscribe(response =>{
      this.encuestas = response.data['encuestas']
      console.log(this.preguntasEdit)
      console.log(response.data['encuestas'])
    })
  }

  insertEncuesta(encuesta: any){
    let json = JSON.stringify(encuesta.encuesta)
    console.log(encuesta)
    this.apollo.mutate({
      mutation: Query.createEncuesta,
      variables: {
        nombre: encuesta.nombre,
        estado: encuesta.estado,
        descripcion: encuesta.descripcion,
        encuesta: json
      },
      update:(proxy, {data: { createEncuesta }}) =>{
        const data: any = proxy.readQuery({ query: Query.Encuestas });
        console.log(data, createEncuesta);
        this.encuestas.push(createEncuesta);

        proxy.writeQuery({ query: Query.Encuestas, data });
      }
    }).subscribe(({ data }) => {
      console.log(data)
      this.getEncuestas();
    },(error) => {
      console.error('error', error)
    });
  }

  /*---------------------------//////////////////////////////////////////////////////////////////////////////////////////////////--------------------------------*/
  updateEncuesta(){

  }

  editarEncuesta(){
    this.editEncuesta = true
    this.editarPregunta = false
    
  }
  editPreguntaEncuesta(pregunta: any){
    this.editarPregunta = true
    this.question = pregunta
    this.formRespuestas.get('pregunta').setValue(pregunta.pregunta)
    this.formRespuestas.get('select').setValue(pregunta.tipo)
    if(pregunta.tipo == "Pregunta Abierta"){
      this.opcionMultiple = false
    }else if (pregunta.tipo == "Opcion Multiple"){
      this.opcionMultiple = true
    }
    this.formRespuestas.get('respuesta1').setValue(pregunta.respuesta1)
    this.formRespuestas.get('respuesta2').setValue(pregunta.respuesta2)
    this.formRespuestas.get('respuesta3').setValue(pregunta.respuesta3)
    this.formRespuestas.get('respuesta4').setValue(pregunta.respuesta4)
    this.formRespuestas.get('respuesta5').setValue(pregunta.respuesta5)
    this.editar = true;
  }

  updatePreguntaEdit(){
    this.preguntasEdit.splice(this.question.id, 1, this.formRespuestas.value)
    this.formRespuestas.get('pregunta').setValue('')
    this.formRespuestas.get('select').setValue(this.question.tipo) 
    this.formRespuestas.get('respuesta1').setValue('')
    this.formRespuestas.get('respuesta2').setValue('')
    this.formRespuestas.get('respuesta3').setValue('')
    this.formRespuestas.get('respuesta4').setValue('')
    this.formRespuestas.get('respuesta5').setValue('')
    this.editar = false;
    this.editarPregunta = false
    if(this.question.tipo == "Pregunta Abierta"){
      this.opcionMultiple = false
    }else if (this.question.tipo == "Opcion Multiple"){
      this.opcionMultiple = true
    }
  }
  visualizar(encuesta){
    this.preguntasEdit = []
    this.encuestaEdit = []
    this.respuestasEdit = []
    console.log(encuesta)
    this.ver = true;
    this.encuestaEdit = encuesta
    this.preguntasEdit = encuesta.encuesta
    this.preguntas = encuesta.encuesta

    this.formRespuestas.get('nombre').setValue(encuesta.nombre)
    this.formRespuestas.get('descripcion').setValue(encuesta.descripcion)


    /*if(encuesta.tipo != "Pregunta Abierta"){*/
      this.preguntasEdit.forEach(element => {
        let respuestas = {
          'respuesta1': element.respuesta1,
          'respuesta2' : element.respuesta2,
          'respuesta3' : element.respuesta3,
          'respuesta4' : element.respuesta4,
          'respuesta5' : element.respuesta5,
        }
        this.respuestasEdit.push(respuestas)
      });

      console.log(this.respuestasEdit)

    //} 
  }
  /*---------------------------//////////////////////////////////////////////////////////////////////////////////////////////////--------------------------------*/

  deleteEncuesta(id:any){
    this.apollo.mutate({
      mutation: Query.deleteEncuesta,
      variables: {
        id: id
      },
      update : (proxy, {data: { deleteEncuesta }}) => {
        const data: any = proxy.readQuery( { query: Query.Encuestas });

        const index = this.encuestas.findIndex( x=> x.id == id)
        console.log("hola")
        console.log(index)
        this.encuestas.splice(index,1);

        proxy.writeQuery({ query: Query.Encuestas, data})
        
      }
    }).subscribe(({ data }) => {
      console.log(data)
      this.getEncuestas();
    }, (error) => {
      console.log('error', error);
    });
    
  }

  guardar(){
    this.newPregunta()
    let encuesta = {
      'encuesta' : this.preguntas,
      'estado' : "finalizada",
      'nombre' : this.formRespuestas.get('nombre').value,
      'descripcion' : this.formRespuestas.get('descripcion').value
    }
    this.encuestas.push(encuesta)
    this.cancelEncuesta()
    console.log(this.encuestas)
    this.idPregunta = 0;
    this.contadorPreguntas = 0;
  }

  deletePregunta(pregunta){
    let i = 0
    this.preguntas.forEach(item => {
      if(pregunta == item.pregunta){
        this.preguntas.splice(i, 1);
        console.log(this.preguntas)
      }else{
        i++
      }
    });
  }


  
}

