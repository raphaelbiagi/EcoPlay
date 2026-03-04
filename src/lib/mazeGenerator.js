/**
 * Maze Generator using DFS Recursive Backtracker
 *
 * Each cell has walls: { top, right, bottom, left }
 * Returns a 2D array of cells.
 */

export function generateMaze(rows, cols) {
    // Initialize grid with all walls
    const grid = [];
    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            grid[r][c] = {
                row: r,
                col: c,
                walls: { top: true, right: true, bottom: true, left: true },
                visited: false,
            };
        }
    }

    // DFS stack-based backtracker
    const stack = [];
    const start = grid[0][0];
    start.visited = true;
    stack.push(start);

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = getUnvisitedNeighbors(current, grid, rows, cols);

        if (neighbors.length === 0) {
            stack.pop();
        } else {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            removeWall(current, next);
            next.visited = true;
            stack.push(next);
        }
    }

    // Clean up visited flags
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            delete grid[r][c].visited;
        }
    }

    return grid;
}

function getUnvisitedNeighbors(cell, grid, rows, cols) {
    const { row, col } = cell;
    const neighbors = [];

    if (row > 0 && !grid[row - 1][col].visited) neighbors.push(grid[row - 1][col]);
    if (row < rows - 1 && !grid[row + 1][col].visited) neighbors.push(grid[row + 1][col]);
    if (col > 0 && !grid[row][col - 1].visited) neighbors.push(grid[row][col - 1]);
    if (col < cols - 1 && !grid[row][col + 1].visited) neighbors.push(grid[row][col + 1]);

    return neighbors;
}

function removeWall(a, b) {
    const dr = b.row - a.row;
    const dc = b.col - a.col;

    if (dr === -1) { a.walls.top = false; b.walls.bottom = false; }
    if (dr === 1) { a.walls.bottom = false; b.walls.top = false; }
    if (dc === -1) { a.walls.left = false; b.walls.right = false; }
    if (dc === 1) { a.walls.right = false; b.walls.left = false; }
}

/**
 * Check if player can move from (r1,c1) to (r2,c2) — must be adjacent and no wall between them.
 */
export function canMove(grid, r1, c1, r2, c2) {
    const dr = r2 - r1;
    const dc = c2 - c1;

    // Must be exactly 1 step in one direction
    if (Math.abs(dr) + Math.abs(dc) !== 1) return false;

    const cell = grid[r1][c1];
    if (dr === -1) return !cell.walls.top;
    if (dr === 1) return !cell.walls.bottom;
    if (dc === -1) return !cell.walls.left;
    if (dc === 1) return !cell.walls.right;

    return false;
}
