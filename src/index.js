import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Category from './components/category'

const inicial = [
  {
    id: 'item-1',
    content: 'item 1',
    level: 0,
    leval_up: null
  },
  {
    id: 'item-2',
    content: 'item 2',
    level: 1,
    leval_up: 'item-1'
  },
  {
    id: 'item-3',
    content: 'item 3',
    level: 0,
    leval_up: null
  },
  {
    id: 'item-4',
    content: 'item 4-',
    level: 1,
    level_up: 'item-3'
  },
  {
    id: 'item-5',
    content: 'item 5-',
    level: 2,
    level_up: 'item-4'
  },
  {
    id: 'item-6',
    content: 'item 6',
    level: 1,
    level_up: 'item-3'
  },
  {
    id: 'item-7',
    content: 'item 7',
    level: 1,
    level_up: 'item-3'
  },
  {
    id: 'item-8',
    content: 'item 8',
    level: 2,
    level_up: 'item-7'
  },
]

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  console.log(list, startIndex, endIndex, list[0])
  if (endIndex === 0) {
    result[endIndex].level_up = null
    result[endIndex].level = 0
  } else {
    result[endIndex].level_up = result[endIndex - 1].id
    result[endIndex].level = (result[endIndex - 1].level + 1 < 5) ? result[endIndex - 1].level + 1 : 4
  }
  console.log(result)


  return result;
};


const getItemStyle = (isDragging, draggableStyle, level) => ({
  userSelect: "none",
  padding: 3,
  margin: `0 0 3px 0`,
  marginLeft: level * 8,

  // change background colour if dragging
  background: isDragging ? "#f00" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#fff" : "#fff",
  padding: 3,
  width: 450
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: inicial//getItems(6)
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    console.log('entra en grad')
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

  nuevo_elemento = (item, elemento) => {
    console.log(item, elemento)
    console.log({ id: `item-${new Date().getTime()}`, content: elemento, level: item.level + 1, level_up: item.id })
    var items = []
    this.state.items.map(v => {
      items.push(v)
      if (v.id === item.id) {
        items.push({ id: `item-${new Date().getTime()}`, content: elemento, level: item.level + 1, level_up: item.id })
      }
    })
    this.setState({ items })
  }

  borra_elemento = (item) => {
    var items = []
    this.state.items.map(v => { if (v.id !== item.id) items.push(v) })
    this.setState({ items })
  }

  cambia_nombre = (item, nombre) => {
    var i = this.state.items.find(e => e.id === item.id)
    i.content = nombre
  }

  reordena_lista = (items, id) => {
    console.log('entra en reordenar')
    var level_inicial = null
    var array_indices = []
    var movidos = []
    movidos.push(id)

    items.map((v, i) => {

      if (v.level_up === id && level_inicial === null) {
        level_inicial = v.level
      }

      console.log('existe', existe, movidos, id)

      //array_indices.map((x, i) => (i > v.level) ? x = null : null)
      //array_indices.map((x, i) => console.log(i , v.level))
      //console.log(array_indices)
      //console.log('esta caaambia', v.level, level_inicial)
      if (level_inicial !== null && level_inicial <= v.level) {

        console.log(movidos)
        var existe = movidos.find(e => e === v.level_up)

        //si se movio
        if (existe) {
          if(array_indices[v.level-1]){
            v.level_up = array_indices[v.level-1]
            
          }else{
            v.level--
            v.level_up = array_indices[v.level-1]
            movidos.push(v.id)
          }

        } else {

        }
        array_indices[v.level] = v.id

        console.log('eeeeeeeeeeeeeeeeeeentra')

        //v.level_up = (v.level - 1 < level_inicial) ? array_indices[level_inicial-1] : array_indices[v.level - 1]
      } else {
        //if()
        //level_inicial = null
      }
      //console.log('__>', v, id, level_inicial, array_indices)
    })
    console.log('FIN::', items)
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
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
