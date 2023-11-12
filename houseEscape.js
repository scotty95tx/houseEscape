class MazeSolver {
  constructor() {
    this.table = document.getElementById("table");
    this.mazeArray = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.addingWalls = false
    this.findingExit = false
    this.originalMazeArray = this.mazeArray.map((row) => [...row])
    this.visitedArray = new Array(this.mazeArray.length).fill(false).map(() => new Array(this.mazeArray[0].length).fill(false))
    this.createTable()
    this.createListeners()
    document.getElementById("resetMaze").style.display = 'none'
  }

  createTable() {
    for (let i = 0; i < this.mazeArray.length; i++) {
      let row = this.table.insertRow()
      for (let j = 0; j < this.mazeArray[i].length; j++) {
        let cell = row.insertCell()
        this.updateClassNames(cell, this.mazeArray[i][j])
      }
    }
  }

  resetMaze() {
    this.mazeArray = this.originalMazeArray.map((row) => [...row]);
    this.visitedArray = new Array(this.mazeArray.length).fill(false).map(() => new Array(this.mazeArray[0].length).fill(false))

    for (let i = 0; i < this.mazeArray.length; i++) {
      for (let j = 0; j < this.mazeArray[i].length; j++) {
        this.updateClassNames(this.table.rows[i].cells[j],this.mazeArray[i][j])
      }
    }
    this.foundExit = false
  }

  updateClassNames(cell, value) {
    if (value === 0) {
      cell.className = "wall"
    } else if (value === 1) {
      cell.className = "openPath"
      cell.id = cell;
    } else if (value === 2) {
      cell.className = "exit"
    }
  }

  async updateCellToVisitedClassName(cell, delay) {
    await new Promise((resolve) => setTimeout(resolve, delay))
    cell.className = "visited"
  }

  async findExit(row, column, visited) {
    if (this.mazeArray[row][column] === 2) {
      this.foundExit = true
      console.log("We have found the exit")
    } else if (this.mazeArray[row][column] === 1 && !this.foundExit && !visited[row][column]) {
      visited[row][column] = true
      await this.updateCellToVisitedClassName(this.table.rows[row].cells[column], 100)
      if (row < this.mazeArray.length - 1) {
        await this.findExit(row + 1, column, visited)
      }
      if (column < this.mazeArray[row].length - 1) {
        await this.findExit(row, column + 1, visited)
      }
      if (row > 0) {
        await this.findExit(row - 1, column, visited)
      }
      if (column > 0) {
        await this.findExit(row, column - 1, visited)
      }
    }
  }

  addWalls(wallRow, wallCell) {
    if (this.addingWalls == true && this.findingExit == false) {
      if (this.mazeArray[wallRow][wallCell] === 0) {
        this.mazeArray[wallRow][wallCell] = 1
        this.originalMazeArray = this.mazeArray.map((row) => [...row])
        this.updateClassNames(this.table.rows[wallRow].cells[wallCell], 1)
      } else if (this.mazeArray[wallRow][wallCell] === 1) {
        this.mazeArray[wallRow][wallCell] = 0
        this.originalMazeArray = this.mazeArray.map((row) => [...row])
        this.updateClassNames(this.table.rows[wallRow].cells[wallCell], 0)
      }
    }
  }

  addListenerToOpenPaths(pathCell) {
    let pathRow = pathCell.closest("tr").rowIndex
    let pathColumn = pathCell.closest("td").cellIndex

    this.findExit(pathRow, pathColumn, this.visitedArray)
  }

  createListeners() {
    document.getElementById("resetMaze").addEventListener("click", () => {
      this.resetMaze()
    });

    document.getElementById("addWalls").addEventListener("click", () => {
      if (this.addingWalls == true) {
        this.addingWalls = false
        document.getElementById("findExit").style.display = 'block'
        document.getElementById("addWalls").innerHTML = 'Building Mode'
      } else if (this.addingWalls == false) {
        this.addingWalls = true
        document.getElementById("findExit").style.display = 'none'
        document.getElementById("resetMaze").style.display = 'none'
        document.getElementById("addWalls").innerHTML = 'Disable Building Mode'
      }

      let cells = document.getElementsByTagName("td")
      for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", () => {
          let wallRow = cells[i].closest("tr").rowIndex
          let wallCell = cells[i].closest("td").cellIndex
          this.addWalls(wallRow, wallCell)
        })
      }
    })

    document.getElementById("findExit").addEventListener("click", () => {
      let pathCells = document.getElementsByClassName("openPath")
      if (this.findingExit == true) {
        document.getElementById("resetMaze").style.display = 'none'
        document.getElementById("addWalls").style.display = 'block'
        document.getElementById("findExit").innerHTML = 'Escape Mode'
        this.findingExit = false
        for (let i = 0; i < pathCells.length; i++) {
          let pathCell = pathCells[i]
          pathCell.removeEventListener("click", this.openPathClickListener);
        }
      } else if (this.findingExit == false) {
        document.getElementById("resetMaze").style.display = 'block'
        document.getElementById("addWalls").style.display = 'none'
        document.getElementById("findExit").innerHTML = 'Disable Escape Mode'
        this.findingExit = true
        this.openPathClickListener = (event) => this.addListenerToOpenPaths(event.target)
        for (let i = 0; i < pathCells.length; i++) {
          let pathCell = pathCells[i]
          pathCell.addEventListener("click", this.openPathClickListener)
        }
      }
    })
  }
}

const mazeSolver = new MazeSolver()
