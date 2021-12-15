import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Category from './components/category'
import Inicial from './inicial'

import './index.css'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  if (endIndex === 0) {
    result[endIndex].level_up = null
    result[endIndex].level = 0
  } else {
    result[endIndex].level_up = result[endIndex - 1].id
    result[endIndex].level = (result[endIndex - 1].level + 1 < 5) ? result[endIndex - 1].level + 1 : 4
  }

  return result;
};


const getItemStyle = (isDragging, draggableStyle, level) => ({
  margin: 1,
  marginLeft: level * 20,
  background: isDragging ? "#eee" : "#fff",
  ...draggableStyle
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: Inicial
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.reordena_lista(items, this.state.items[result.source.index].id)

    this.setState({
      items
    });
  }

  //genera un nuevo elementro llamandose del componente, toma como padre el superior directo
  nuevo_elemento = (item, elemento) => {
    var items = []
    this.state.items.map(v => {
      items.push(v)
      if (v.id === item.id) {
        items.push({ id: `item-${new Date().getTime()}`, content: elemento, level: item.level + 1, level_up: item.id })
      }
    })
    this.setState({ items })
  }

  //borra el elemento llamandose del componente
  borra_elemento = (item) => {
    var items = []
    this.state.items.map(v => { if (v.id !== item.id) items.push(v) })
    this.reordena_lista(items, item.id)
    this.setState({ items })
  }

  //edita el nombre llamandose del componente
  cambia_nombre = (item, nombre) => {
    var i = this.state.items.find(e => e.id === item.id)
    i.content = nombre
  }

  //reordena la lista cuando se mueve un elemento o elimina
  reordena_lista = (items, id) => {
    var level_inicial = null
    var array_indices = []
    var movidos = []
    movidos.push(id)

    items.map((v, i) => {
      //primero se busca el primer hijo para tomar el nivel de produndidad
      if (v.level_up === id && level_inicial === null) {
        level_inicial = v.level
      }

      if (level_inicial !== null && level_inicial <= v.level) {
        //si encontro un nodo a cambiar verifica si el padre fue modificado para corregirse
        var existe = movidos.find(e => e === v.level_up)
        if (existe) {
          if (array_indices[v.level - 1]) {
            //si tiene un padre nuevo se adopta
            v.level_up = array_indices[v.level - 1]
          } else {
            //si no tiene padre directo sube un nivel
            v.level--
            v.level_up = array_indices[v.level - 1]
            movidos.push(v.id)
          }
        }
      }
      array_indices[v.level] = v.id
      array_indices.splice(v.level + 1, 5 - v.level)

    })
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="content"
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className="element"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        item.level
                      )}
                    >
                      <Category
                        label={item.content}
                        item={item}
                        onDelete={this.borra_elemento}
                        changeName={this.cambia_nombre}
                        newElement={this.nuevo_elemento}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
