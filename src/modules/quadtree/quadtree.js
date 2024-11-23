export class QuadTree {
    constructor(boundary, capacity = 8) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        const { x, y, width, height } = this.boundary;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        this.northwest = new QuadTree({ x, y, width: halfWidth, height: halfHeight }, this.capacity);
        this.northeast = new QuadTree({ x: x + halfWidth, y, width: halfWidth, height: halfHeight }, this.capacity);
        this.southwest = new QuadTree({ x, y: y + halfHeight, width: halfWidth, height: halfHeight }, this.capacity);
        this.southeast = new QuadTree({ x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight }, this.capacity);

        this.divided = true;
    }

    insert(point) {
        if (!this.contains(this.boundary, point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        if (this.northwest.insert(point)) return true;
        if (this.northeast.insert(point)) return true;
        if (this.southwest.insert(point)) return true;
        if (this.southeast.insert(point)) return true;

        return false;
    }

    query(range, found = []) {
        if (!this.intersects(this.boundary, range)) {
            return found;
        }

        for (const point of this.points) {
            if (this.contains(range, point)) {
                found.push(point);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    contains(rect, point) {
        return pointInRect(rect, point.x, point.y) || pointInRect(rect, point.x + point.width, point.y + point.height);
    }

    intersects(rect1, rect2) {
        return !(
            rect1.x + rect1.width <= rect2.x ||
            rect1.x >= rect2.x + rect2.width ||
            rect1.y + rect1.height <= rect2.y ||
            rect1.y >= rect2.y + rect2.height
        );
    }

    remove(point) {
        if (!this.contains(this.boundary, point)) {
            return false;
        }

        const index = this.points.findIndex(p => p.x === point.x && p.y === point.y);
        if (index !== -1) {
            this.points.splice(index, 1);
            return true;
        }

        if (this.divided) {
            if (this.northwest.remove(point)) return true;
            if (this.northeast.remove(point)) return true;
            if (this.southwest.remove(point)) return true;
            if (this.southeast.remove(point)) return true;
        }

        return false;
    }

    move(oldPoint, newPoint) {
        if (this.remove(oldPoint)) {
            return this.insert(newPoint);
        }
        return false;
    }
}

function pointInRect(rect, x, y) {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}