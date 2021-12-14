// set the dimensions and margins of the graph
var margin = {
    top: 30,
    right: 30,
    bottom: 70,
    left: 60
  },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#bar1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");



// append the svg object to the body of the page
var svg2 = d3.select("#bar2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");





$(document).ready(function() {
  // populate dropdown w options
  function fillDropDown(selectMenu, data, keysToRemove) {
    data.forEach(function(obj) {
      if (keysToRemove.includes(obj[0]) === false) {
        selectMenu.append($('<option></option>').val(obj[0]).html(obj[0]));
      }
    });
  }

  /*
  ajax to retrieve data from sqlite3 table
  */
  async function getDBData(query) {
    let result;
    try {
      result = await $.ajax({
        type: "GET",
        url: "https://sysbio.informatics.iupui.edu/primer_project/demo/league2.php?",
        data: "q=" + query
      })
      return JSON.parse(result);
    } catch (error) {
      return [];
    }
  }

  function intOrFloat(items, prop) {
    try {
      items.forEach(function(obj) {
        obj[prop] = parseInt(obj[prop]);
      });
    } catch (e) {
      items.forEach(function(obj) {
        obj[prop] = parseFloat(obj[prop]);
      });
    }
    return items;
  }


  function plotDoubleBarCharts(data1, data2, quantity) {
    // clear svgs
    svg1.selectAll("*").remove();
    svg2.selectAll("*").remove();

    var maxNum1 = Math.max.apply(Math, data1.map(function(o) {
      return o.number;
    }));
    var maxMargin1 = maxNum1 + Math.round(maxNum1 * 0.1);

    var maxNum2 = Math.max.apply(Math, data2.map(function(o) {
      return o.number;
    }));
    var maxMargin2 = maxNum2 + Math.round(maxNum2 * 0.1);

    // x-axis 1
    var x1 = d3.scaleBand()
      .range([0, width])
      .domain(data1.map(function(d) {
        return d.result;
      }))
      .padding(0.2);

    svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x1))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y1 = d3.scaleLinear()
      .domain([0, maxMargin1])
      .range([height, 0]);
    svg1.append("g")
      .call(d3.axisLeft(y1));

    svg1.selectAll("bar1content")
      .data(data1)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x1(d.result);
      })
      .attr("y", function(d) {
        return y1(d.number);
      })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) {
        return height - y1(d.number);
      })
      .attr("fill", "#69b3a2")

    // x-axis 1
    var x2 = d3.scaleBand()
      .range([0, width])
      .domain(data2.map(function(d) {
        return d.result;
      }))
      .padding(0.2);

    svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y2 = d3.scaleLinear()
      .domain([0, maxMargin2])
      .range([height, 0]);
    svg2.append("g")
      .call(d3.axisLeft(y2));

    svg2.selectAll("bar2content")
      .data(data2)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x2(d.result);
      })
      .attr("y", function(d) {
        return y2(d.number);
      })
      .attr("width", x2.bandwidth())
      .attr("height", function(d) {
        return height - y2(d.number);
      })
      .attr("fill", "#69b3a2")

  }


  function plotSingleBarChart(data, quantity) {
    // clear svgs
    svg1.selectAll("*").remove();
    svg2.selectAll("*").remove();
    // get max prop value
    var maxNum = Math.max.apply(Math, data.map(function(o) {
      return o.number;
    }));
    var maxMargin = maxNum + Math.round(maxNum * 0.1);


    // X axis
    var x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(function(d) {
        return d.result;
      }))
      .padding(0.2);
    svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, maxMargin])
      .range([height, 0]);
    svg1.append("g")
      .call(d3.axisLeft(y));

    svg1.selectAll("bar1content")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.result);
      })
      .attr("y", function(d) {
        return y(d.number);
      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return height - y(d.number);
      })
      .attr("fill", "#69b3a2")




  }


  function parseResponse(response, matchData) {
    var categoricalVals = ['firstBloodAssist', 'firstBloodKill', 'firstTowerAssist', 'firstTowerKill', 'gameEndedInEarlySurrender', 'gameEndedInSurrender', 'gameEndedInSurrender', 'lane', 'role', 'summonerId', 'summonerName', 'teamEarlySurrendered', 'teamId', 'teamPosition'];
    if (categoricalVals.includes(matchData)) {
      var gameWinSummary = [];
      var gameLoseSummary = [];

      var names = [...new Set(response.map(response => response[matchData]))];
      names.forEach(function(obj) {
        //console.log(response);
        let winNum = response.filter(o => o[matchData] == obj && o.win == "TRUE").length;
        let loseNum = response.filter(o => o[matchData] == obj && o.win == "FALSE").length;


        gameWinSummary.push({
          'result': obj,
          'number': winNum
        });
        gameLoseSummary.push({
          'result': obj,
          'number': loseNum
        });

      })

      plotDoubleBarCharts(gameWinSummary, gameLoseSummary, matchData);

    }
    // numerical data
    else {
      let winNum = response.filter(o => o.win == "TRUE");
      let loseNum = response.filter(o => o.win == "FALSE");
      // convert str to int or float
      var winParsed = intOrFloat(winNum, matchData);
      var loseParsed = intOrFloat(loseNum, matchData);
      let winAvg = Math.round(winParsed.reduce((total, next) => total + next[matchData], 0) / winParsed.length);
      let loseAvg = Math.round(loseParsed.reduce((total, next) => total + next[matchData], 0) / loseParsed.length);
      var result = [{
        "result": "win",
        "number": winAvg
      }, {
        "result": "lose",
        "number": loseAvg
      }];
      plotSingleBarChart(result, matchData);
    }




  }



  function updateQuery() {
    var champ = document.getElementById("champSelect").value;
    var league = document.getElementById("league").value;
    var matchData = $("#leagueDataHeaders :selected").text();

    var query = `select ${matchData}, win from LeagueMatches where championName = '${champ}' and league = '${league}';`;
    getDBData(query).then(response => parseResponse(response, matchData));
  }


  /*
  Fill out the dropdowns with our retrieved data
  */

  // champion names
  getDBData("select distinct championName from LeagueMatches").then(response => fillDropDown($("#champSelect"), response, []));
  // all other data
  getDBData("select name from pragma_table_info('LeagueMatches') order by cid").then(response => fillDropDown($("#leagueDataHeaders"), response, ["league", "matchId", "division", "championId", "championName", "win", "teamId", "puuid"]));
  // league
  getDBData("select distinct league from LeagueMatches").then(response => fillDropDown($("#league"), response, []));




  $('.queryModifier').on("change", function() {
    updateQuery();
  })





});
