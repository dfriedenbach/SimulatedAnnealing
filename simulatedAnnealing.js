var knapsack = {items: [], maxWeight: 17, currentWeight: 0}; // NP-hard
var items = [ // allowed multiple of each
  {name:'apple',    weight:3, value:20},
  {name:'blanket',  weight:4, value:40},
  {name:'lantern',  weight:5, value:10},
  {name:'radio',    weight:6, value:30}
];

function generateRandomSolution(){
  var solution = [];
  var weight = 0;
  while (weight <= knapsack.maxWeight) {
    solution.push(items[randomIndex(items)]);
    weight += solution[solution.length - 1].weight;
  }
  solution.pop();
  return solution; // array of items, must be <= maxWeight
};

function generateNeighboringSolution(oldSolution){
  // add, swap, or remove item randomly
  var choices = ['add', 'swap', 'remove'];
  var weight = weigh(oldSolution);
  var foundSolution = false;
  var solution;
  while (!foundSolution) {
    var index = randomIndex(oldSolution);
    var choice = choices[randomIndex(choices)];
    if (choice === 'add') {
      var newItem = items[randomIndex(items)];
      if (weight + newItem.weight <= knapsack.maxWeight) {
        solution = oldSolution.slice();
        solution.push(newItem);
        foundSolution = true;
      }
    } else if (choice === 'swap') {
      var oldItem = oldSolution[index];
      newItem = items[randomIndex(items)];
      if (weight + newItem.weight - oldItem.weight <= knapsack.maxWeight) {
        solution = oldSolution.slice();
        solution[index] = newItem;
        foundSolution = true;
      }
    } else {
      solution = oldSolution.slice().splice(index, 1);
      foundSolution = true;
    }
  }
  return solution; // array of items, must be <= maxWeight
}

function calculateCost(solution){
  var cost = _.reduce(_.pluck(solution, 'value'), function(a,b){return a + b;});
  return cost; // sum of values of items
}

function acceptance_probability(old_cost, new_cost, temperature){
  return Math.pow(Math.E, (new_cost - old_cost)/temperature); // probability to jump
}

function simulateAnnealing(){
  var solution = generateRandomSolution();
  var oldCost = calculateCost(solution);
  var newSolution;
  var newCost
  var ap;
  var T = 1;
  var Tmin = 0.00001;
  var alpha = 0.9;

  while (T > Tmin) {
    for (var i = 0; i < 100; i++) {
      newSolution = generateNeighboringSolution(solution);
      newCost = calculateCost(newSolution);
      ap = acceptance_probability(oldCost, newCost, T);
      if (ap > Math.random()) {
        solution = newSolution;
        oldCost = newCost;
      }
    }
    T *= alpha;
  }

  return solution; // array of items, must be <= maxWeight
};

///////////////////////////////////
// HELPER FUNCTIONS              //
// don't modify, but you can use //
///////////////////////////////////

function randomIndex(list){
  return Math.floor(Math.random()*list.length);
}

function weigh(solution){
  return solution.reduce(function(total, item){ return total + item.weight}, 0);
}
