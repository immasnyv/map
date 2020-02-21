function NodeMap(mapNodes) {
    this.nodes = {};

    this.addNodeByNeighbours = function(nodeName, nodeX, nodeY, nodeNeighbours) {
        nodeNeighbours = nodeNeighbours || null;
        
        this.nodes[nodeName] = {
            x: nodeX,
            y: nodeY,
            neighbours: nodeNeighbours
        };
    }
    
    this.addNodeByPosition = function(nodeName, nodeX, nodeY, roomLevel) {
        let nearestNode = ["","","",""], nearestDist = [Infinity, Infinity, Infinity, Infinity];

        // look for nearest node in each direction (above, under, on the left, on the right)
        for(let node in this.nodes) {
            if(node.includes("S") || !node.includes(roomLevel) || (this.nodes[node].y != nodeY && this.nodes[node].x != nodeX))
                continue;
            
            let dist = Math.abs(this.nodes[node].x - nodeX) + Math.abs(this.nodes[node].y - nodeY);
            
            if(this.nodes[node].y > nodeY && dist <= nearestDist[0]) { // above
                nearestDist[0] = dist;
                nearestNode[0] = node;
            } else if(this.nodes[node].y < nodeY && dist <= nearestDist[1]) { // under
                nearestDist[1] = dist;
                nearestNode[1] = node;
            } else if(this.nodes[node].x > nodeX && dist <= nearestDist[2]) { // on the left
                nearestDist[2] = dist;
                nearestNode[2] = node;
            } else if(this.nodes[node].x < nodeX && dist <= nearestDist[3]) { // on the right
                nearestDist[3] = dist;
                nearestNode[3] = node;
            }
        }

        let neighboursDists = {};

        // write relation of new node and neighbour nodes to neighbour nodes
        for(let i = 0; i < nearestNode.length; i++) {
            if(nearestNode[i] != "") {
                neighboursDists[nearestNode[i]] = nearestDist[i];
                this.nodes[nearestNode[i]].neighbours[nodeName] = nearestDist[i];		
            }
        }

        this.addNodeByNeighbours(nodeName, nodeX, nodeY, neighboursDists);
    }

    this.removeNode = function(nodeName) {
        if(this.nodes[nodeName] !== undefined) {
            delete this.nodes[nodeName];
        }
    }

    // fill the mNodeMap with nodes from mapNodes json file (and compute distances between neighbours)
    for (let node in mapNodes) {
        let neighbours = mapNodes[node].neighbour.split(",");
        let neighboursDistances = {};

        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
            let x = Math.abs(mapNodes[neighbour].x - mapNodes[node].x);
            let y = Math.abs(mapNodes[neighbour].y - mapNodes[node].y);

            neighboursDistances[neighbour] = x + y;
        }
        
        this.addNodeByNeighbours(node, mapNodes[node].x, mapNodes[node].y, neighboursDistances);
    }
}