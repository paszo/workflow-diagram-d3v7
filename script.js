const data = {
  nodes: [
    {
      name: "excel_queue",
      label: "Excel Queue",
      value: 0,
      link: "https://www.google.com/",
      positionX: 1,
      positionY: 0,
    },
    {
      name: "data_import_queue",
      label: "Data Import Queue",
      value: "x",
      link: "https://www.google.com/",
      positionX: 1,
      positionY: 1,
    },
    {
      name: "process_invoices",
      label: "Process Invoices",
      value: 73,
      link: "https://www.google.com/",
      positionX: 1,
      positionY: 2,
    },
    {
      name: "processing_hold",
      label: "Processing Hold",
      value: 4,
      link: "https://www.google.com/",
      positionX: 1,
      positionY: 3,
    },
    {
      name: "burst_and_combine",
      label: "Burst and Combine",
      value: 11,
      link: "https://www.google.com/",
      positionX: 0,
      positionY: 2,
    },
    {
      name: "corrections_queue",
      label: "Corrections Queue",
      value: 1,
      link: "https://www.google.com/",
      positionX: 0,
      positionY: 3,
    },
    {
      name: "ready_to_fund",
      label: "Ready to Fund",
      value: 1,
      link: "https://www.google.com/",
      positionX: 2,
      positionY: 2,
    },
  ],
  links: [
    {
      startX: 1,
      startY: 0,
      endX: 1,
      endY: 1,
    },
    {
      startX: 1,
      startY: 1,
      endX: 1,
      endY: 2,
    },
    {
      startX: 1,
      startY: 2,
      endX: 1,
      endY: 3,
    },
    {
      startX: 0,
      startY: 2,
      endX: 1,
      endY: 2,
    },
    {
      startX: 0,
      startY: 2,
      endX: 0,
      endY: 3,
    },
    {
      startX: 1,
      startY: 2,
      endX: 2,
      endY: 2,
    },
  ],
};

const settings = {
  width: 600,
  height: 300,
  parentId: "chart",
  margin: { top: 50, bottom: 50, left: 100, right: 50 },
  nodeWidth: 150,
  nodeHeight: 30,
  distanceHorizontal: 200,
  distanceVertical: 60,
  fontSize: 12,
  radius: 3,
  rectangleColor: "#439ec5",
  hoverColor: "#4eb63f",
  rectangleBorderColor: "gray",
  textColor: "white",
  linkColor: "gray",
};

function drawChart(settings, data) {
  d3.select(`#${settings.parentId}`).selectAll("svg").remove();

  const svg = d3
    .select(`#${settings.parentId}`)
    .append("svg")
    .attr("width", settings.width)
    .attr("height", settings.height);

  const mainGroup = svg
    .append("g")
    .attr("class", "main-group")
    .attr(
      "transform",
      `translate(${settings.margin.left}, ${settings.margin.top})`
    );

  const links = mainGroup
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("x1", (d) => d.startX * settings.distanceHorizontal)
    .attr("x2", (d) => d.endX * settings.distanceHorizontal)
    .attr("y1", (d) => d.startY * settings.distanceVertical)
    .attr("y2", (d) => d.endY * settings.distanceVertical)
    .style("stroke", settings.linkColor);

  const nodes = mainGroup
    .selectAll("a")
    .data(data.nodes)
    .enter()
    .append("a")
    .attr("class", "link-nodes")
    .attr("xlink:href", (d) => d.link)
    .append("g")
    .attr(
      "transform",
      (d) =>
        `translate(${
          d.positionX * settings.distanceHorizontal - settings.nodeWidth / 2
        },${d.positionY * settings.distanceVertical - settings.nodeHeight / 2})`
    )
    .on("mouseover", function () {
      d3.select(this).select("rect").style("fill", settings.hoverColor);
    })
    .on("mouseout", function () {
      d3.select(this).select("rect").style("fill", settings.rectangleColor);
    });

  nodes
    .append("rect")
    .attr("width", settings.nodeWidth)
    .attr("height", settings.nodeHeight)
    .style("fill", settings.rectangleColor)
    .attr("rx", settings.radius)
    .attr("ry", settings.radius)
    .attr("stroke", settings.rectangleBorderColor);

  nodes
    .append("text")
    .text((d) => `${d.label} (${d.value})`)
    .attr("text-anchor", "middle")
    .attr("y", settings.nodeHeight / 2 + settings.fontSize / 3)
    .attr("x", settings.nodeWidth / 2)
    .style("fill", settings.textColor)
    .style("font-family", "sans-serif")
    .style("font-size", settings.fontSize);
}

drawChart(settings, data);
