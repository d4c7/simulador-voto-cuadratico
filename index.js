window.addEventListener('load', function () {


	const VoterType = Object.freeze({
		Leal: 'Leal',
		Flexible: 'Flexible',
		Random: 'Random',
		Blank: 'Blank'
	});

	const VotingContext = Object.freeze({
		LowStability: 'LowStability',
		NormalStability: 'NormalStability',
		HighStability: 'HighStability',
	});

	const IdeologicalDistribution = Object.freeze({
		gauss: 'gauss',
		bimodgauss: 'bimodgauss',
		uniform: 'uniform',
		leftskew: 'leftskew',
		rightskew: 'rightskew',
	});

	const IdeologicalDistributionFeatures = (function () {
		const m = [];
		m[IdeologicalDistribution.gauss] = { name: "Estabilidad Baja", voterTypeDistribution: [0.5, 0.3, 0.19, 0.01], description: "En este contexto, se refiere a una situación en la que las condiciones económicas, políticas y sociales son generalmente positivas y predecibles. Los cambios son graduales y generalmente se anticipan con suficiente antelación. En un escenario de alta estabilidad, los votantes pueden sentirse más seguros y confiados en sus decisiones de voto, y puede haber menos fluctuaciones en las preferencias de voto." };
		m[IdeologicalDistribution.bimodgauss] = { name: "Distribución con Dos Focos", description: "Esta distribución sugiere que hay dos grupos principales de votantes, cada uno centrado alrededor de un punto particular en el espectro ideológico, es decir, hay dos 'picos' en la distribución. Esto puede indicar una sociedad polarizada en la que la mayoría de los votantes se identifican con uno de dos puntos de vista ideológicos opuestos." };
		m[IdeologicalDistribution.uniform] = { name: "Distribución Uniforme", description: "En esta distribución, los votantes están igualmente repartidos a lo largo de todo el espectro ideológico. Esto puede sugerir una sociedad en la que no hay una ideología dominante y los votantes tienen una amplia variedad de puntos de vista." };
		m[IdeologicalDistribution.leftskew] = { name: "Distribución con Tendencia a un Lado", description: "En esta distribución, una mayor cantidad de votantes se concentra hacia un extremo del espectro ideológico. Esto puede sugerir una sociedad en la que una ideología en particular es más popular o aceptada que otras. Este tipo de distribución es asimétrica y tiene un 'sesgo' hacia un lado del espectro." };
		m[IdeologicalDistribution.rightskew] = { name: "Distribución con Tendencia a otro lado", description: "En esta distribución, una mayor cantidad de votantes se concentra hacia un extremo del espectro ideológico. Esto puede sugerir una sociedad en la que una ideología en particular es más popular o aceptada que otras. Este tipo de distribución es asimétrica y tiene un 'sesgo' hacia un lado del espectro." };
		return m;
	})();


	const VotingContextFeatures = (function () {
		const m = [];
		m[VotingContext.HighStability] = { name: "Estabilidad Alta", voterTypeDistribution: [0.5, 0.3, 0.19, 0.01], description: "En este contexto, se refiere a una situación en la que las condiciones económicas, políticas y sociales son generalmente positivas y predecibles. Los cambios son graduales y generalmente se anticipan con suficiente antelación. En un escenario de alta estabilidad, los votantes pueden sentirse más seguros y confiados en sus decisiones de voto, y puede haber menos fluctuaciones en las preferencias de voto." };
		m[VotingContext.NormalStability] = { name: "Estabilidad Normal", voterTypeDistribution: [0.3, 0.4, 0.25, 0.05], description: "Este es un escenario intermedio en el que hay cierto grado de incertidumbre y cambio, pero también cierta previsibilidad y continuidad. Las condiciones económicas, políticas y sociales pueden estar en un estado de cambio moderado, y los votantes pueden cambiar sus preferencias de voto en respuesta a estos cambios, pero no necesariamente de manera radical o impredecible.", };
		m[VotingContext.LowStability] = { name: "Estabilidad Baja", voterTypeDistribution: [0.1, 0.25, 0.55, 0.10], description: "Este es un escenario en el que hay una gran cantidad de incertidumbre y cambio. Las condiciones económicas, políticas y sociales pueden ser volátiles y cambiar rápidamente y de formas impredecibles. En un escenario de baja estabilidad, los votantes pueden sentirse inseguros y confundidos, y las preferencias de voto pueden fluctuar ampliamente." };
		return m;
	})();

	const VoterTypeFeatures = (function () {
		const m = [];
		m[VoterType.Leal] = { name: "Leal", rng: 0.05, novote: 0.01, minvote: 1, maxvote: 1, description: "Este votante tiene un fuerte sentido de identidad partidista y siempre vota por el partido que le es más afín (pueden ser varios pero sólo votará a uno generalmente), independientemente de las circunstancias de la elección o los candidatos específicos." }
		m[VoterType.Flexible] = { name: "Flexible", rng: 0.10, novote: 0.01, minvote: 1, maxvote: 4, description: "Este votante tiene varios partidos que considera afines y está dispuesto a votar por cualquiera de ellos, dependiendo de las circunstancias de la elección y de los candidatos específicos. Su voto no es necesariamente para el partido que considera más afín." }
		m[VoterType.Random] = { name: "Volátil", rng: 0.85, novote: 0.02, minvote: 0, maxvote: 100, description: "Este votante no tiene una fuerte identidad partidista y es capaz de votar por una amplia gama de partidos, incluso algunos que no considera particularmente afines. Su elección de voto puede ser muy impredecible y puede estar influenciada por una variedad de factores, incluyendo las cuestiones de la elección, los candidatos específicos, la cobertura mediática y las opiniones de las personas de su entorno." }
		m[VoterType.Blank] = { name: "No voto", rng: 0.95, novote: 0.85, minvote: 0, maxvote: 1, description: "Este votante elige expresamente no votar por ningún partido o candidato y en su lugar emite un voto en blanco. Esto puede ser una protesta contra todas las opciones disponibles, una expresión de descontento con el sistema político en general, o simplemente una elección de no participar activamente en la elección de un candidato o partido." }
		return m;
	})();



	var dots = []
	var circle;

	const rmain = document.getElementById("main").getBoundingClientRect();
	const width = Math.max(700, rmain.width);
	const height = Math.max(400, rmain.height);

	const r = document.getElementById("settings").getBoundingClientRect();
	const widthSettings = r.width;
	const heightSettings = r.width / 1.618;

	const svg = d3.select("#viz")
		.attr("width", width)
		.attr("height", height)
		.style("display", "block")

	const svgSettings = d3.select("#viz-settings")
		.attr("width", widthSettings)
		.attr("height", heightSettings)
		.style("display", "block")


	const scaleX = d3.scaleLinear().domain([0, 1]).range([0, width]);
	const scaleY = d3.scaleLinear().domain([0, 1]).range([0, height])
	const scaleXSettings = d3.scaleLinear().domain([0, 1]).range([0, widthSettings])
	const scaleYSettings = d3.scaleLinear().domain([0, 1]).range([0, heightSettings])


	const scaleColor = d3.schemeDark2;

	var currentForces = []

	var tooltip = d3.select("body")
		.append("div")
		.attr('id', 'tooltip')
		.attr('style', 'position: absolute; opacity: 0;')


	var simdistrib = "gauss"
	var simsize = 100;
	let simcontext = VotingContext.NormalStability;

	let description = document.getElementById("description")

	//let resetButton = document.getElementById("reset")

	let runsButton = document.getElementById("runs")
	let runqButton = document.getElementById("runq")

	let simChoiceSelect = document.getElementById("simchoice")

	let simSizeInput = document.getElementById("simsize")

	let simContextSelect = document.getElementById("simcontext")

	//starting data for candidates on simulation
	var candidates = [
		{ index: 0.3, id: 0 },
		{ index: 0.4, id: 1 },
		{ index: 0.6, id: 2 },
		{ index: 0.7, id: 3 },
	]

	let simulationBallots;

	let parties = [
		"Opción A",
		"Opción B",
		"Opción C",
		"Opción D",
		"Opción E"
	]

	const updateSettings = function () {
		const simchoiceDesc = document.getElementById("simchoice-description");
		const idf = IdeologicalDistributionFeatures[simdistrib];
		simchoiceDesc.innerText = idf.description;

		const simcontextDesc = document.getElementById("simcontext-description");
		const vcf = VotingContextFeatures[simcontext];
		simcontextDesc.innerText = vcf.description;

	}


	//called at each simulation tick
	function ticked() {
		circle
			.attr("cx", d => d.x)
			.attr("cy", d => d.y)
			.attr("x", d => d.x)
			.attr("y", d => d.y)

		for (i = 0; i < dots.length; i++) {
			var dot = dots[i];
			dot.cx = dot.x;
			dot.cy = dot.y;
			//!!!
			//	dot.x = dot.x;
			//dot.y = dot.y;
		}
	}

	function expandVoteRank(data, ranknum) {
		newdata = [];
		data.forEach(i => {
			for (let r = 0; r < ranknum; r++) {
				const il = i.votes.length;
				if (il == 0) {
					if (r == 0) newdata.push(i);
				} else if (il > r) {
					const p = structuredClone(i);
					p.votes = p.votes.slice(r, r + 1);
					newdata.push(p);
				}
			}
		});
		newdata.meta = structuredClone(data.meta);
		return newdata;
	}


	function renderGraph(name, data, quadratic = false, ranknum = 0, shape = "circle") {
		const r = (d) => quadratic ?
			Math.min(10, d.votes.length == 0 ? data.meta.maxVotes : (3 + d.votes[ranknum].votes))
			:
			(shape == "circle" ? 4 : 8)
			;

		circle = svg.selectAll("." + name)
			.data(data)
			.join(shape)
			.attr("class", name)
			.attr("voterid", function (d) {
				return d.id;
			})
			.style("fill", function (d) {
				if (d.votes.length == 0) {
					return "#2F2D2E";
				}
				return scaleColor[d.votes[ranknum].candidate];
			})
			.style("filter", "drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.8))")

			.attr("cx", function (d) { return scaleX(d.x) })
			.attr("cy", function (d) { return scaleY(d.y) })
			.attr("x", function (d) { return scaleX(d.x) })
			.attr("y", function (d) { return scaleY(d.y) })
			.attr("width", function (d) { return r(d) })
			.attr("height", function (d) { return r(d) })
			.attr("rx", 1)
			.attr("r", function (d) { return r(d) })

			.on('mouseover', function (event, d) {
				tooltip
					.html(d.text)
					.transition()
					.duration(80)
					.style('display', 'block')
					.style('opacity', 1)
					.style('left', (event.pageX + 15) + 'px')
					.style('top', (event.pageY - 15) + 'px')

			})
			.on('mouseout', function (e) {
				tooltip
					.style('opacity', 0)
					.style('display', 'none')
			})
			.on('click', (event, d) => {
				d3.selectAll("[voterid='" + d.id + "']")
					.style("stroke", "black")
					.style("opacity", 1)
				d3.selectAll(".viz-shape:not([voterid='" + d.id + "']),.viz-shape-2:not([voterid='" + d.id + "'])")
					.style("opacity", 0.5)
					.style("stroke", "none")

			})
	}

	//wipe screen
	function clearGraph(savecircles = false) {
		if (!savecircles) {
			svg.selectAll(".viz-shape").remove()
		}
		svg.selectAll(".viz-shape").style("opacity", 1)
		svg.selectAll(".cluster-label").remove()
		svg.selectAll(".cluster-number").remove()
		svg.selectAll(".toptext").remove()


		svg.selectAll(".viz-shape-2").remove()

		clearForces()
	}

	//get rid of active forces
	function clearForces() {
		for (ind in currentForces) {
			force = currentForces[ind]
			force.stop()
		}
		curentForces = []
	}

	//generate force at location
	function generateForce(data, xcenter, ycenter) {

		force = d3.forceSimulation(data)
			.force("collide", d3.forceCollide(5).strength(1))
			.force('forceX', d3.forceX(scaleX(xcenter)))
			.force('forceY', d3.forceY(scaleY(ycenter)))
			.force("charge", d3.forceManyBody().strength(1))
			.alpha(0.4)

		currentForces.push(force)

		return force;

	}

	function initializeElectionData(data) {

		data.forEach((d, i) => {

			d.x = scaleX(d.x);
			d.y = scaleY(d.y);

			let text = "<b>Votante " + d.id + "</b>, rationale";

			text += "<ul>";
			{
				text += "<li>Tipo: " + VoterTypeFeatures[d.voterType].name + "<p class='description'>" + VoterTypeFeatures[d.voterType].description + "</p></li>";
				text += "<li>Afinidad (consciente o no)<ul>";
				{
					d.affinity.forEach((affinity, i) => {
						text += "<li>" + parties[affinity.candidate] + ": " + affinity.distance.toFixed(2) + "</li>";
					});
				}
				text += "</ul></li>"

				text += "<li><b>Decisión de voto final</b><ul>";
				{
					text += "<li>Sistema de voto simple<ul>"
					{
						if (d.votes.length == 0) {
							text += "<li>En blanco</li>";
						} else {
							const vote = d.votes[0]
							text += "<li>" + parties[vote.candidate] + "</li>";
						}
					}
					text += "</ul></li>";


					text += "<li>Sistema de voto cuadrático<ul>"
					{
						if (d.votes.length == 0) {
							text += "<li> En blanco: " + data.meta.maxVotes + " votos" + " (" + data.meta.totalPoints + " puntos)</li> ";
						} else {
							d.votes.forEach((vote, i) => {
								text += "<li> " + parties[vote.candidate] + ": " + vote.votes + " voto" + (vote.points > 1 ? "s" : "") + " (" + vote.points + " puntos)</li> ";
							});

							if (d.remainingPoints > 0) {
								text += "<li> Sin usar " + d.remainingPoints + " punto" + (d.remainingPoints > 1 ? "s" : "") + "</li> ";
							}
						}
					}
					text += "</ul></li>";
				}
				text += "</ul></li>";
			}
			text += "</ul>";
			d.text = text
		})

	}

	//simulate round as visualization
	function runRound(data0, roundnum, newy, quadratic) {

		const tot_candidates = data0.meta.candidates.length;

		clearForces()

		if (roundnum == 0) {
			clearGraph(savecircles = true)
			let force = generateForce(data0, 0.5, newy)
			force.stop()
			force.on("tick", ticked).restart()
			simulationText("Visualización del electorado y sus mentes", "Cada círculo representa un individuo único y su voto principal. Al deslizar el cursor sobre cada uno, se revela la lógica detrás de su decisión de voto, ilustrando su elección en un sistema de votación cuadrática y en un sistema de votación tradicional. Pulsa los botones para ver cómo se reparten los votos en cada uno de los sistemas y cómo cada sistema afecta al resultado final de la votación.");
			return
		}

		let ranknum = 0;


		let data = expandVoteRank(data0, quadratic ? tot_candidates : 1);

		const optionVotes = new Array(tot_candidates + 1).fill(0);


		data.forEach(v => {
			if (0 == v.votes.length) {
				optionVotes[0] += quadratic ? data.meta.maxVotes : 1;
			} else {
				for (let i = 0; i < (quadratic ? v.votes.length : 1); i++) {
					optionVotes[v.votes[i].candidate + 1] += (quadratic ? v.votes[i].votes : 1);
				}
			}
		});

		const totalVotes = optionVotes.reduce((a, b) => a + b);
		const pcVotes = optionVotes.map(v => v / totalVotes);


		clearGraph(savecircles = true);


		renderGraph("viz-shape-2", data, quadratic, ranknum, "rect");

		for (let i = 0; i < data.length; i++) {
			let dot = data[i];
			let x = dot.votes.length == 0 ? 0 : dot.votes[ranknum].candidate + 1;
			dot.newx = (x * 1.0) / (tot_candidates + 1);
		}

		//TODO: group alt 
		let x_locs = Array.from({ length: tot_candidates + 1 }, (_, i) => i).map(x => x * 1.0 / (tot_candidates + 1))

		let all_subset_dots = x_locs.map(x => data.filter(dot => dot.newx == x));

		for (ind in all_subset_dots) {
			let subset_dots = all_subset_dots[ind]
			let x_loc = x_locs[ind];

			force = generateForce(subset_dots, x_loc + 0.1, newy)
			force.stop()
			force.on("tick", ticked).restart()
		}

		svg.selectAll(".cluster-label")
			.data(all_subset_dots)
			.join("text")
			.attr("class", "cluster-label")
			.text((d, i) => {
				if (i == 0) {
					return "En blanco"
				} else {
					return parties[i - 1];
				}
			})
			.attr("font-weight", (d, i) => {
				return ""//bold si winner
			})
			.attr("text-decoration", (d, i) => {
				if (all_subset_dots[i].length == 0) {
					return "line-through"
				}
			})
			.attr("id", (d, i) => "cluster-label-" + i)
			.attr("x", (d, i) => scaleX(x_locs[i] + 0.1))
			.attr("y", scaleY(newy + 0.2))
			.attr("text-anchor", "middle")
			.attr("font-size", "15px")

		svg.selectAll(".cluster-number")
			.data(all_subset_dots)
			.join("text")
			.attr("class", "cluster-number")
			.attr("id", (d, i) => "cluster-number-" + i)
			.text((d, i) => {
				return "Votos: " + optionVotes[i] + "\n(" + (pcVotes[i] * 100).toFixed(0) + "%)"
			})
			.attr("x", (d, i) => {
				return scaleX(x_locs[i] + 0.1)
			})
			.attr("y", scaleY(newy + 0.25))
			.attr("text-anchor", "middle")
			.attr("font-size", "15px")

		svg.selectAll(".cluster-label")
			.transition()
			.duration(500)
			.style("opacity", (d, i) => {
				if (all_subset_dots[i].length == 0) {
					return 0.1
				}
				return 1
			})
		svg.selectAll(".cluster-number")
			.transition()
			.duration(500)
			.style("opacity", (d, i) => {
				if (all_subset_dots[i].length == 0) {
					return 0.1
				}
				return 1
			})

		svg.selectAll(".viz-shape")
			.transition()
			.duration(500)
			.style("opacity", d => {
				return 1
			})

		if (quadratic) {
			simulationText("Visualización del voto cuadrático", "Los votos están representados por los cuadrados, los distintos tamaños indican el número de votos asignado. Puedes hacer click sobre un votante y ver cómo ha repartido sus votos entre las disitntas opciones.");

		} else {
			simulationText("Visualización del voto simple", "Cada votante emite un voto representado por un cuadrado");
		}
	}

	function simulationText(t, d) {
		d3.select("#simulation-description")
			.interrupt()
			.style("opacity", 1)
			.text(d);
		d3.select("#simulation-description-title")
			.interrupt()
			.style("opacity", 1)
			.text(t);
	}

	//https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/39187274#39187274
	//approx. gaussian
	function gaussianRand() {
		var rand = 0;

		for (var i = 0; i < 6; i += 1) {
			rand += Math.random();
		}

		return rand / 6;
	}

	//sample from one of two gaussians to simulate two peaks
	function bimodGaussianRand() {
		if (Math.random() < 0.5) {
			//gaussian from 0 to 0.6
			return gaussianRand() * 0.6
		} else {
			//gaussian from 0.4 to 1.0
			return 0.4 + gaussianRand() * 0.6
		}
	}


	function shuffleArray(array, start) {
		for (let i = array.length - 1; i > start; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}


	//!todo: con combinatoria
	function generateQuadraticCombinations(n) {
		let combinations = [];
		for (let i = 1; i <= Math.sqrt(n); i++) {
			if (n - i * i > 0) {
				let subCombinations = generateQuadraticCombinations(n - i * i);
				for (let j = 0; j < subCombinations.length; j++) {
					combinations.push([i].concat(subCombinations[j]));
				}
			} else {
				combinations.push([i]);
			}
		}
		return combinations;
	}


	function assignQuadraticVotes(voteCombinations, distances, preferenceIndices) {
		// Initialize the best combination and its score
		let bestCombination = null;
		let bestScore = 0;

		// Iterate over each vote combination
		for (let votes of voteCombinations) {
			if (votes.length < preferenceIndices.length) {
				continue;
			}
			// Calculate the score for this combination
			let score = 0;
			for (let i = 0; i < votes.length; i++) {
				// The score is the sum of votes divided by distance for each option
				const d = distances[preferenceIndices[i]];
				if (d > 0) {
					score += votes[i] / d;
				}
			}

			// If this score is the best so far, update the best combination and score
			if (score > bestScore) {
				bestCombination = votes;
				bestScore = score;
			}
		}

		if (!bestCombination) {
			return [];
		}
		// Return the best vote combination
		return bestCombination.slice(0, preferenceIndices.length);
	}



	function weightedSample(options, distribution) {
		const random = Math.random();
		let acc = 0;
		for (let i = 0; i < options.length; i++) {
			acc += distribution[i];
			if (random <= acc) {
				return options[i];
			}
		}
		return undefined;
	}


	function simulate(candidates, size, context) {
		let ballots = []
		const totalPoints = candidates.length * candidates.length;
		const voteCombinations = generateQuadraticCombinations(totalPoints);
		const vcf = VotingContextFeatures[simcontext];

		for (let idx = 0; idx < size; idx++) {

			let sample_index;
			switch (simdistrib) {
				case "gauss":
					sample_index = gaussianRand();
					break;
				case "bimodgauss":
					sample_index = bimodGaussianRand();
					break;
				case "leftskew":
					sample_index = stdlib.base.random.beta(4, 2)
					break;
				case "rightskew":
					sample_index = stdlib.base.random.beta(2, 4)
					break;
				case "uniform":
				default:
					sample_index = Math.random();
			}


			const voterType = weightedSample(Object.keys(VoterType), vcf.voterTypeDistribution);

			const vtf = VoterTypeFeatures[voterType];

			const distances = candidates.map(x => Math.abs(x.index - sample_index) + vtf.rng * 2 * Math.random())

			let preferenceIndices = distances
				.map((e, i) => ({ ind: i, val: e }))
				.sort((x, y) => x.val > y.val ? 1 : x.val == y.val ? 0 : -1)
				.map(e => e.ind);


			for (let j = 0; j < preferenceIndices.length; j++) {
				if (Math.random() < vtf.novote) {
					preferenceIndices.splice(j, preferenceIndices.length - j)
				}
				if (Math.random() < vtf.rng) {
					shuffleArray(preferenceIndices, j)
					break;
				}
			}

			if (preferenceIndices.length > 1) {
				preferenceIndices = preferenceIndices.slice(0, vtf.minvote + Math.random() * (vtf.maxvote - vtf.minvote));
			}

			const votes = assignQuadraticVotes(voteCombinations, distances, preferenceIndices)


			let remainingPoints = totalPoints;
			for (let j = 0; j < preferenceIndices.length; j++) {
				const costPoints = votes[j] * votes[j];
				preferenceIndices[j] = {
					candidate: preferenceIndices[j],
					points: costPoints,
					votes: votes[j]
				};
				remainingPoints -= costPoints;

			}

			const affinity = [];
			for (let j = 0; j < candidates.length; j++) {
				affinity.push({
					candidate: j,
					distance: distances[j]
				});
			}

			let dot = {
				id: ballots.length,
				voterType: voterType,
				affinity: affinity.sort((a, b) => a.distance - b.distance),
				votes: preferenceIndices,
				remainingPoints: remainingPoints,
				totalPoints: totalPoints,
				//x: Math.random(),
				x: 0.5,
				y: 0.5
			}
			ballots.push(dot)
		}


		ballots.meta = {
			population: size,
			candidates: candidates,
			context: context,
			totalPoints: totalPoints,
			maxVotes: Math.sqrt(totalPoints)
		}

		return ballots

	}



	//update the simulation
	function updateSimulationInit() {
		updateSettings();
		drawSimulation()
		clearGraph()
		simulationBallots = simulate(candidates, simsize, simcontext);
		initializeElectionData(simulationBallots, candidates);
		renderGraph("viz-shape", simulationBallots);
		runRound(simulationBallots, 0, 0.17)
	}

	function drawCandidates(w, xmid, ymid) {
		let scaledw = w * widthSettings

		let xstart = scaleXSettings(xmid) - scaledw / 2
		let xend = scaleXSettings(xmid) + scaledw / 2

		candidates.forEach((d) => {
			d.x = d.index * scaledw + xstart
			d.y = scaleYSettings(ymid)
		})

		let drag = () => {

			let dragXScale = d3.scaleLinear()
				.domain([xstart, xend])
				.range([xstart, xend])
				.clamp(true)

			function dragstarted(event, d) {
				d3.select(this).raise()
					.attr("stroke", null)
					.attr("r", 10)
					.style("cursor", "grabbing");




			}

			function dragged(event, d) {
				d3.select(this).attr("cx", d.x = dragXScale(event.x))
				d.index = (d.x - xstart) / scaledw
			}

			function dragended(event, d) {
				d3.select(this)
					.attr("stroke", "black")
					.attr("r", 6)
					.style("cursor", "grab")
				updateSimulationInit();
			}

			return d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended);

		}

		let rectDrawn = svgSettings.select("#rectslider").node()

		if (!rectDrawn) {
			svgSettings.append("rect")
				.attr("x", xstart)
				.attr("y", scaleYSettings(ymid - 0.02))
				.attr("width", scaledw)
				.attr("height", scaleYSettings(0.04))
				.attr("fill", "grey")
				.attr("opacity", "0.1")
				.on("click", (event, d) => {
					if (candidates.length >= 5) {
						return
					}
					let ind = (event.x - xstart) / scaledw
					candidates.push({
						index: ind,
						id: candidates.length,
						x: ind * scaledw + xstart,
						y: scaleYSettings(ymid)
					})

					updateSimulationInit();
					drawCandSliders()

				})
				.attr("id", "rectslider")
				.style("cursor", "copy")
		}

		//draw each candidate on the bar below distribution
		function drawCandSliders() {
			svgSettings.selectAll(".candidates")
				.data(candidates)
				.join("circle")
				.attr("class", "candidates")
				.attr("cx", d => d.x)
				.attr("cy", d => d.y)
				.attr("r", 6)
				.attr("id", (d, i) => "candidate" + i)
				.call(drag())
				.on("contextmenu", (event, d) => {

					event.preventDefault();

					if (candidates.length <= 2) {
						return;
					}

					//d3.select(this).remove()
					event.currentTarget.remove()
					candidates.splice(d.id, 1)

					//update ids to match index in array
					candidates.forEach((d, i) => {
						d.id = i;
					});

					//recolorize dots
					svgSettings.selectAll(".candidates")
						.transition()
						.duration(500)
						.attr("fill", (d, i) => scaleColor[i])
						.call(updateSimulationInit)




				})
				.attr("fill", (d, i) => scaleColor[i])
				.attr("stroke", "black")
				.on('mouseover', function (event, d) {
					tooltip
						.transition()
						.duration(80)
						.style('display', 'block')
						.style('opacity', 1)
						.text(parties[d.id])
						.style('left', (event.pageX - 15) + 'px')
						.style('top', (event.pageY + 15) + 'px')
						.transition()
						.duration(30000)
						.style('opacity', 0)
						.transition()
						.delay(1000)
						.style("display", "none")
				})
				.on('mouseout', function (e) {
					tooltip
						.style('opacity', 0)
						.style('display', 'none')
				})



				.style("cursor", "grab")

		}

		drawCandSliders();
	}


	function getGaussianLine(w, h, xcenter, ycenter) {
		w = widthSettings * w
		h = heightSettings * h
		xcenter = scaleXSettings(xcenter)
		ycenter = scaleYSettings(ycenter)

		let normal = function (mean, variance) {
			// Precompute portion of the function that does not depend on x
			let predicate = 1 / Math.sqrt(variance * 2 * Math.PI);

			//console.log(predicate)
			return function (x) {
				// See the pdf function from http://en.wikipedia.org/wiki/Normal_distribution
				return predicate * Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
			};
		}

		let xseries = [];
		xseries.push(-0.5)
		for (var i = 0; i <= 1000; i++) { xseries.push((i * 1.0 / 1000 - 0.5)); }
		xseries.push(0.5)

		let normalTransform = normal(0, .5 / 8)
		let yseries = xseries.map(d => normalTransform(d));
		let max = Math.max(...yseries)
		yseries = yseries.map(d => d / max)

		yseries[0] = 0.1
		yseries[1002] = 0.1


		let combinedSeries = d3.zip(xseries, yseries);

		let line = d3.line()
			.x(d => (d[0]) * w + (xcenter))
			.y(d => (1 - d[1]) * (h) + (ycenter))

		return [line, combinedSeries]
	}

	function getUniformLine(w, h, xcenter, ycenter) {
		w = widthSettings * w
		h = heightSettings * h
		xcenter = scaleXSettings(xcenter)
		ycenter = scaleYSettings(ycenter)


		let xseries = [];
		xseries.push(-0.5)
		for (var i = 0; i <= 1000; i++) { xseries.push((i * 1.0 / 1000 - 0.5)); }
		xseries.push(0.5)

		let yseries = xseries.map(d => 0.5);
		yseries[0] = 0.1
		yseries[1002] = 0.1

		let combinedSeries = d3.zip(xseries, yseries);

		let line = d3.line()
			.x(d => d[0] * w + (xcenter))
			.y(d => (1 - d[1]) * (h) + (ycenter))

		return [line, combinedSeries]
	}

	function getLeftSkewLine(w, h, xcenter, ycenter) {
		w = widthSettings * w
		h = heightSettings * h
		xcenter = scaleXSettings(xcenter)
		ycenter = scaleYSettings(ycenter)


		let xseries = [];
		xseries.push(-0.5)
		for (var i = 0; i <= 1000; i++) { xseries.push((i * 1.0 / 1000 - 0.5)); }
		xseries.push(0.5)


		let yseries = xseries.map(d => stdlib.base.dists.beta.pdf(d + 0.5, 4, 2));
		let max = Math.max(...yseries)
		yseries = yseries.map(d => d / max + 0.1)

		yseries[0] = 0.1
		yseries[1002] = 0.1

		let combinedSeries = d3.zip(xseries, yseries);

		let line = d3.line()
			.x(d => d[0] * w + (xcenter))
			.y(d => (1 - d[1]) * (h) + (ycenter))

		return [line, combinedSeries]
	}

	function getRightSkewLine(w, h, xcenter, ycenter) {
		w = widthSettings * w
		h = heightSettings * h
		xcenter = scaleXSettings(xcenter)
		ycenter = scaleYSettings(ycenter)


		let xseries = [];
		xseries.push(-0.5)
		for (var i = 0; i <= 1000; i++) { xseries.push((i * 1.0 / 1000 - 0.5)); }
		xseries.push(0.5)


		let yseries = xseries.map(d => stdlib.base.dists.beta.pdf(d + 0.5, 2, 4));
		let max = Math.max(...yseries)
		yseries = yseries.map(d => d / max + 0.1)

		yseries[0] = 0.1
		yseries[1002] = 0.1

		let combinedSeries = d3.zip(xseries, yseries);

		let line = d3.line()
			.x(d => d[0] * w + (xcenter))
			.y(d => (1 - d[1]) * (h) + (ycenter))

		return [line, combinedSeries]
	}

	function getBimodalGaussianLine(w, h, xcenter, ycenter) {
		w = widthSettings * w
		h = heightSettings * h
		xcenter = scaleXSettings(xcenter)
		ycenter = scaleYSettings(ycenter)

		let normal = function (mean, variance) {
			// Precompute portion of the function that does not depend on x
			let predicate = 1 / Math.sqrt(variance * 2 * Math.PI);

			//console.log(predicate)
			return function (x) {
				// See the pdf function from http://en.wikipedia.org/wiki/Normal_distribution
				return predicate * Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
			};
		}

		let xseries = [];
		xseries.push(-0.5)
		for (var i = 0; i <= 1000; i++) { xseries.push((i * 1.0 / 1000 - 0.5)); }
		xseries.push(0.5)

		let normalTransform1 = normal(-.25, .25 / 8)
		let normalTransform2 = normal(.25, .25 / 8)

		let yseries = xseries.map(d => normalTransform1(d) + normalTransform2(d) - 0.65);
		let max = Math.max(...yseries)
		yseries = yseries.map(d => d / max)

		yseries[0] = 0.1
		yseries[1002] = 0.1
		let combinedSeries = d3.zip(xseries, yseries);

		let line = d3.line()
			.x(d => d[0] * w + (xcenter))
			.y(d => (1 - d[1]) * (h) + (ycenter))

		return [line, combinedSeries]

	}


	simChoiceSelect.onchange = () => {
		simdistrib = simChoiceSelect.value
		updateSimulationInit()
	}

	simContextSelect.onchange = () => {
		simcontext = simContextSelect.value
		updateSimulationInit()
	}

	simSizeInput.onchange = () => {
		simsize = parseInt(simSizeInput.value)
		updateSimulationInit()
	}

	function drawSimulation() {

		let simwidth = 0.85
		let simheight = 0.60
		let simystart = 0.2
		let simline, series;

		if (simdistrib == "gauss") {
			[simline, series] = getGaussianLine(simwidth, simheight, 0.5, simystart)
		}
		if (simdistrib == "bimodgauss") {
			[simline, series] = getBimodalGaussianLine(simwidth, simheight, 0.5, simystart)
		}
		if (simdistrib == "uniform") {
			[simline, series] = getUniformLine(simwidth, simheight, 0.5, simystart)
		}
		if (simdistrib == "leftskew") {
			[simline, series] = getLeftSkewLine(simwidth, simheight, 0.5, simystart)
		}
		if (simdistrib == "rightskew") {
			[simline, series] = getRightSkewLine(simwidth, simheight, 0.5, simystart)
		}

		drawCandidates(simwidth, 0.5, simheight + simystart)

		let distribpath = svgSettings.select("#simline").node()
			? svgSettings.select("#simline")
			: svgSettings.append("path")

		distribpath
			.datum(series)
			.transition()
			.duration(1000)
			.attr('d', simline)
			.attr("fill", "url(#redbluegrad")
			.attr("id", "simline")

	}

	//fade in to start
	d3.select("body")
		.style("opacity", 0)
		.transition()
		.duration(1000)
		.style("opacity", 1);


	runsButton.onclick = () => {
		runRound(simulationBallots, 1, 0.7, false)
	}


	runqButton.onclick = () => {
		runRound(simulationBallots, 1, 0.7, true)
	}


	updateSimulationInit();

})
