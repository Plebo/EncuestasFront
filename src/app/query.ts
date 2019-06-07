
'use strict'

import gql from 'graphql-tag';
export const createEncuesta = gql` 
    mutation createEncuesta($encuesta: JSON!,$estado: String!,  $nombre: String! , $descripcion: String! ){
        createEncuesta(encuesta: $encuesta, estado:$estado, nombre:$nombre, descripcion:$descripcion ){
            id,
            encuesta,
            estado,
            nombre,
            descripcion 
          }
    } `;

export const updateEncuesta = gql`
    mutation updateEncuesta($id: Int!,$encuesta: JSON!,$estado: String!, $nombre: String! , $descripcion: String!){
        updateEncuesta(id: $id,encuesta: $encuesta, estado:$estado, nombre:$nombre, descripcion:$descripcion){
            id,
            encuesta,
            estado,
            nombre,
            descripcion  
          }
    } `;
export const deleteEncuesta = gql`
    mutation deleteEncuesta($id: Int!){
        deleteEncuesta(id: $id){
            id,
            encuesta,
            estado 
          }
    } `;
export const Encuestas =  gql`
    query{
        encuestas{
            id,
            nombre,
            descripcion,
            encuesta,
            estado, 
        }
    }`;