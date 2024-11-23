export class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary; // Boundary is a rectangle { x, y, width, height }
        this.capacity = capacity; // Max items in this node before splitting
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
        // Check if the point lies within the boundary
        if (!this.contains(this.boundary, point)) {
            return false;
        }

        // If capacity is not reached, store the point
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        // If capacity is reached, subdivide and delegate
        if (!this.divided) {
            this.subdivide();
        }

        if (this.northwest.insert(point)) return true;
        if (this.northeast.insert(point)) return true;
        if (this.southwest.insert(point)) return true;
        if (this.southeast.insert(point)) return true;

        return false; // Shouldn't reach here
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
        return (
            point.x >= rect.x &&
            point.x < rect.x + rect.width &&
            point.y >= rect.y &&
            point.y < rect.y + rect.height
        );
    }

    intersects(rect1, rect2) {
        return !(
            rect1.x + rect1.width <= rect2.x ||
            rect1.x >= rect2.x + rect2.width ||
            rect1.y + rect1.height <= rect2.y ||
            rect1.y >= rect2.y + rect2.height
        );
    }
}

