function Djikstra() {
  this.findSmallest = function(dist, q) {
    var min = Infinity;
    var minNode;

    for (var node in q) {
      if (dist[node] <= min) {
        min = dist[node];
        minNode = node;
      }
    }

    delete q[minNode];
    return minNode;
  };

  this.getShortestPaths = function(previous, shortestPaths, startVertex, dist) {
    for (var node in shortestPaths) {
      var path = shortestPaths[node];

      while (previous[node]) {
        path.push(node);
        node = previous[node];
      }

      //gets the starting node in there as well if there was a path from it
      if (dist[node] === 0) {
        path.push(node);
      }
      path.reverse();
    }
  };

  this.calculate = function(graph, startVertex) {
    var dist = {};
    var prev = {};
    var q = {};
    var shortestPaths = {};

    for (var node in graph) {
      dist[node] = Infinity;
      prev[node] = null;
      q[node] = graph[node];
      shortestPaths[node] = [];
    }

    dist[startVertex] = 0;

    while (Object.keys(q).length != 0) {
      var smallest = this.findSmallest(dist, q);
      var smallestNode = graph[smallest];
      //searches for the node u in the node set Q that has the smallest dist[smallest] value.

      for (var neighbour in smallestNode.neighbours) {
        var alt = dist[smallest] + smallestNode.neighbours[neighbour];
        //smallestNode[neighbour] is the distance between smallest and neighbour
        if (alt < dist[neighbour]) {
          dist[neighbour] = alt;
          prev[neighbour] = smallest;
        }
      }
    }

    this.getShortestPaths(prev, shortestPaths, startVertex, dist);

    return {
      shortestPaths: shortestPaths,
      shortestDistances: dist
    };
  };
}
