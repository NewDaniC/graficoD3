import * as d3 from 'd3';
//import data from './dados.json';

const url = "https://v250y1kckj.execute-api.us-east-1.amazonaws.com/metrics?source=dw&ano=2020&estacao=itai&tipo_coleta=ion&doy=001";

export default class D3Chart {
  constructor(element) {
    const svg = d3.select(element)
      .append("svg")
      .attr("width", 1000)
      .attr("height", 500)
      .append("g")
      .attr("transform", "translate(40,20)");

    // Define as margens, largura e altura do gráfico
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.json(url).then(data => {
      console.log('Dados carregados:', data); // Log dos dados carregados

      if (!data || !data.content) {
        console.error('Dados inválidos ou ausentes');
        return;
      }

      // Cria a escala x baseada nas horas
      const xScale = d3.scaleBand()
        .domain(data.content.map(d => d.hora)) // Mapeia as horas nos dados
        .range([0, width]) // Define a faixa de valores no gráfico
        .padding(0.1); // Adiciona um pequeno espaçamento entre as bandas

      // Cria a escala y baseada nos valores de 'I'
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.content, d => d.I)]) // Define o domínio com base nos valores de 'I'
        .range([height, 0]); // Inverte a escala para que 0 fique na parte inferior do gráfico

      // Adiciona o eixo x ao gráfico
      svg.append("g")
        .attr("transform", "translate(0," + height + ")") // Move o eixo x para a parte inferior do gráfico
        .call(d3.axisBottom(xScale)); // Chama a função para gerar o eixo x

      // Adiciona o eixo y ao gráfico
      svg.append("g")
        .call(d3.axisLeft(yScale)); // Chama a função para gerar o eixo y

      // Cria o gerador de linha
      const line = d3.line()
        .x(d => xScale(d.hora) + xScale.bandwidth() / 2) // Define a posição x do ponto
        .y(d => yScale(d.I)); // Define a posição y do ponto

      // Adiciona o caminho de linha ao gráfico
      svg.append("path")
        .datum(data.content) // Liga os dados ao caminho
        .attr("fill", "none") // Remove o preenchimento do caminho
        .attr("stroke", "steelblue") // Define a cor do traçado
        .attr("stroke-width", 1.5) // Define a largura do traçado
        .attr("d", line); // Aplica o gerador de linha aos dados

      console.log('Gráfico gerado com sucesso');
    }).catch(error => {
      console.error('Erro ao carregar os dados:', error);
    });
  }
}

/*
export default class D3Chart {
  constructor(element) {
    // Define margens, largura e altura do gráfico
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Cria um elemento SVG com as dimensões especificadas e aplica a transformação para a margem
    const svg = d3.select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Cria a escala x baseada nos nomes dos satélites
    const xScale = d3.scaleBand()
      .domain(data.content.map(d => d.hora)) // Mapeia os satélites nos dados
      .range([0, width]) // Define a faixa de valores no gráfico
      .padding(0.1); // Adiciona um pequeno espaçamento entre as bandas

    // Cria a escala y baseada nos valores de 'I'
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data.content, d => d.I)]) // Define o domínio com base nos valores de 'I'
      .range([height, 0]); // Inverte a escala para que 0 fique na parte inferior do gráfico

    // Adiciona o eixo x ao gráfico
    svg.append("g")
      .attr("transform", "translate(0," + height + ")") // Move o eixo x para a parte inferior do gráfico
      .call(d3.axisBottom(xScale)); // Chama a função para gerar o eixo x

    // Adiciona o eixo y ao gráfico
    svg.append("g")
      .call(d3.axisLeft(yScale)); // Chama a função para gerar o eixo y

    // Cria o gerador de linha
    const line = d3.line()
      .x(d => xScale(d.hora) + xScale.bandwidth() / 2) // Define a posição x do ponto
      .y(d => yScale(d.I)); // Define a posição y do ponto

    // Adiciona o caminho de linha ao gráfico
    svg.append("path")
      .datum(data.content) // Liga os dados ao caminho
      .attr("fill", "none") // Remove o preenchimento do caminho
      .attr("stroke", "steelblue") // Define a cor do traçado
      .attr("stroke-width", 1.5) // Define a largura do traçado
      .attr("d", line); // Aplica o gerador de linha aos dados
  }
}
*/

/* pontos que funciona
export default class D3Chart {
  constructor(element) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleBand()
      .domain(data.content.map(d => d.satelite))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data.content, d => d.I)])
      .range([height, 0]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    svg.selectAll("circle")
      .data(data.content)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.satelite) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.I))
      .attr("r", 4)
      .attr("fill", "steelblue");
  }
}
*/

/* linhas conectadas do json
export default class D3Chart {
  constructor(element) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 5000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleBand()
      .domain(data.content.map(d => d.satelite))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data.content, d => d.I)])
      .range([height, 0]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    const line = d3.line()
      .x(d => xScale(d.satelite) + xScale.bandwidth() / 2)
      .y(d => yScale(d.I));

    svg.append("path")
      .datum(data.content)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg.selectAll("circle")
      .data(data.content)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.satelite) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.I))
      .attr("r", 4)
      .attr("fill", "steelblue");
  }
}
*/

/* Codigo pontos conectados 
export default class D3Chart {
  constructor(element) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.satelite))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.I)])
      .range([height, 0]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    const line = d3.line()
      .x(d => xScale(d.satelite) + xScale.bandwidth() / 2)
      .y(d => yScale(d.I));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.satelite) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.I))
      .attr("r", 4)
      .attr("fill", "steelblue");
  }
}
*/

/* Não funciona
const url = "https://v250y1kckj.execute-api.us-east-1.amazonaws.com/metrics?source=dw&ano=2020&estacao=itai&tipo_coleta=ion&doy=001"

export default class D3Chart {
  constructor(element) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const xScale = d3.scaleBand()
          .domain(data.map(d => d.satelite))
          .range([0, width])
          .padding(0.1);

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.I)])
          .range([height, 0]);

        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale));

        svg.append("g")
          .call(d3.axisLeft(yScale));

        const line = d3.line()
          .x(d => xScale(d.satelite) + xScale.bandwidth() / 2)
          .y(d => yScale(d.I));

        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line);

        svg.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", d => xScale(d.satelite) + xScale.bandwidth() / 2)
          .attr("cy", d => yScale(d.I))
          .attr("r", 4)
          .attr("fill", "steelblue");
      });
  }
}
*/

/* Dados
const data = [
  {
    "estacao": "ITAI",
    "data": "2020-01-01",
    "DOY": 1,
    "hora": 0,
    "satelite": "G01",
    "azimute": 288.927,
    "elevacao": 78.662,
    "IPPlat": -25.232,
    "IPPlon": -54.974,
    "alturaIPP": 350,
    "DCBr": 14.472,
    "TEC": 7.427,
    "ROT": 0.005,
    "I": 1.206,
    "Fp": 9.338,
    "ROTI": 0.008
  },
  {
    "estacao": "ITAI",
    "data": "2020-01-01",
    "DOY": 1,
    "hora": 0,
    "satelite": "G03",
    "azimute": 204.027,
    "elevacao": 45.775,
    "IPPlat": -27.977,
    "IPPlon": -55.959,
    "alturaIPP": 350,
    "DCBr": 14.472,
    "TEC": 11.834,
    "ROT": 0.009,
    "I": 1.922,
    "Fp": 9.338,
    "ROTI": 0.008
  },
  {
    "estacao": "ITAI",
    "data": "2020-01-01",
    "DOY": 1,
    "hora": 0,
    "satelite": "G04",
    "azimute": 268.966,
    "elevacao": 52.852,
    "IPPlat": -25.397,
    "IPPlon": -57,
    "alturaIPP": 350,
    "DCBr": 14.472,
    "TEC": 0,
    "ROT": 0,
    "I": 0,
    "Fp": 9.338,
    "ROTI": 0.008
  },
  {
    "estacao": "ITAI",
    "data": "2020-01-01",
    "DOY": 1,
    "hora": 0,
    "satelite": "G08",
    "azimute": 346.032,
    "elevacao": 13.39,
    "IPPlat": -16.276,
    "IPPlon": -56.932,
    "alturaIPP": 350,
    "DCBr": 14.472,
    "TEC": 40.789,
    "ROT": 0.011,
    "I": 6.623,
    "Fp": 9.338,
    "ROTI": 0.009
  },
  {
    "estacao": "ITAI",
    "data": "2020-01-01",
    "DOY": 1,
    "hora": 0,
    "satelite": "G09",
    "azimute": 288.648,
    "elevacao": 23.679,
    "IPPlat": -23.312,
    "IPPlon": -60.909,
    "alturaIPP": 350,
    "DCBr": 14.472,
    "TEC": 24.418,
    "ROT": 0.022,
    "I": 3.965,
    "Fp": 9.338,
    "ROTI": 0.008
  }
];
*/

/* Codigo barras
export default class D3Chart {
  constructor(element) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.satelite))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.I)])
      .range([height, 0]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    const rects = svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.satelite))
      .attr("y", d => yScale(d.I))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.I))
      .attr("fill", d => d.I > 6 ? "red" : "green");
  }
}
*/

/* Codigo original
import * as d3 from 'd3';
const url = "https://udemy-react-d3.firebaseio.com/ages.json"

export default class D3Chart {
	constructor(element) {
		const svg = d3.select(element)
			.append("svg")
				.attr("width", 500)
				.attr("height", 500)

		d3.json(url).then(agesData => {
			const rects = svg.selectAll("rect")
				.data(agesData)

			rects.enter()
				.append("rect")
					.attr("x", (d, i) => i * 100)
					.attr("y", 50)
					.attr("width", 50)
					.attr("height", d => d.age * 10)
					.attr("fill", d => {
						if (d.age > 10) {
							return "red"
						}
						return "green"
					})
		})
	}
}
*/