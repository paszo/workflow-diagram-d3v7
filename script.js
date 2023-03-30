// data define the noses and links

const data = {
  // nodes represent the rectangles with labels (clickable with links to the url)
  nodes: [
    {
      name: "excel_queue", // name - not used now, introduced for the future use as a unique id
      label: "Excel Queue", // the displayed name in the node
      value: 0, // the value that is displayed in the parenthesis
      link: "https://www.google.com/", // url in the link
      positionX: 1, // nodes form a zero indexed grid layout each node has a unique combination of position in the grid
      positionY: 0, // the same as above (X0 Y0 is the top left position in the grid)
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
  // links represent the lines between the nodes
  links: [
    {
      startX: 1, // X position in the grid of the first node connected to this link
      startY: 0, // Y position in the grid of the first node connected to this link
      endX: 1, // X position in the grid of the second node connected to this link
      endY: 1, // Y position in the grid of the second node connected to this link
      startArrow: true, // information if the beginning of the link contains the arrow head
      endArrow: true, // information if the end of the link contains the arrow head
    },
    {
      startX: 1,
      startY: 1,
      endX: 1,
      endY: 2,
      startArrow: false,
      endArrow: true,
    },
    {
      startX: 1,
      startY: 2,
      endX: 1,
      endY: 3,
      startArrow: true,
      endArrow: true,
    },
    {
      startX: 1,
      startY: 2,
      endX: 0,
      endY: 2,
      startArrow: false,
      endArrow: false,
    },
    {
      startX: 0,
      startY: 2,
      endX: 0,
      endY: 3,
      startArrow: false,
      endArrow: true,
    },
    {
      startX: 1,
      startY: 2,
      endX: 2,
      endY: 2,
      startArrow: false,
      endArrow: true,
    },
  ],
};

// settings of the svg appearance
const settings = {
  width: 600, // the width of the svg if the scale would be 1
  height: 300, // the height of the svg if the scale would be 1
  parentId: "chart", // the id of the container element where this svg will be embedded
  margin: { top: 50, bottom: 50, left: 100, right: 50 }, // the space from the edge of svg where nodes are printed (in our case the top and left are used)
  nodeWidth: 150, // width of each node (rectangle) in pixels if the scale would be 1
  nodeHeight: 30, // height of each node (rectangle) in pixels if the scale would be 1
  distanceHorizontal: 200, // horizontal distance between centers of the grid system if the scale would be 1
  distanceVertical: 60, // vertical distance between centers of the grid system if the scale would be 1
  fontSize: 12, // size of the font in the rectangles in pixels
  radius: 3, // radius of the rectangle corners
  rectangleColor: "#439ec5", // color of the rectangles
  hoverColor: "#4eb63f", // color of the rectangles on hover
  rectangleBorderColor: "gray", // stroke color of the rectangles
  textColor: "white", // color of the text in rectangles
  linkColor: "gray", // color of the links ( arrows )
  arrowSize: 5, // size of the arrow head
};

// main function which accepts settings and data and print the chart
function drawChart(settings, data) {
  // remove old svg in case the function is called many times (with fresh data)
  d3.select(`#${settings.parentId}`).selectAll("svg").remove();

  // crate svg element and append it to the container element
  const svg = d3
    .select(`#${settings.parentId}`)
    .append("svg")
    .attr("width", "100%")
    .attr("viewBox", `0 0 ${settings.width} ${settings.height}`); // setting the viewBox - so the svg is responsive and rescales to fill the parent element

  // arrow heads
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr(
      "viewBox",
      `0 -${settings.arrowSize} ${settings.arrowSize * 2} ${
        settings.arrowSize * 2
      }`
    )
    .attr("refX", `${settings.arrowSize * 2 - 2}`)
    .attr("markerWidth", `${settings.arrowSize + 1}`)
    .attr("markerHeight", `${settings.arrowSize + 1}`)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr(
      "d",
      `M0,-${settings.arrowSize}L${settings.arrowSize * 2},0L0,${
        settings.arrowSize
      }`
    )
    .style("fill", settings.linkColor);

  // main group - the group is holding all nodes and links - it is moved from the edge of the svg by the margins (top and left)
  const mainGroup = svg
    .append("g")
    .attr("class", "main-group")
    .attr(
      "transform",
      `translate(${settings.margin.left}, ${settings.margin.top})`
    );

  // helper functions to shorten the length of links by appropriate distance - without them the lines would be from the centers of grid system
  function correctionStartX(d) {
    if (d.startX === d.endX) {
      return 0;
    }
    if (d.startX < d.endX) {
      if (d.startArrow) {
        return settings.nodeWidth / 2 + 1; // correction by 1 to make the arrow head be sharp and touch exactly the surface
      } else {
        return settings.nodeWidth / 2;
      }
    }
    if (d.startX > d.endX) {
      if (d.startArrow) {
        return -1 * (settings.nodeWidth / 2 + 1);
      } else {
        return -1 * (settings.nodeWidth / 2);
      }
    }
  }
  function correctionEndX(d) {
    if (d.startX === d.endX) {
      return 0;
    }
    if (d.startX > d.endX) {
      if (d.endArrow) {
        return settings.nodeWidth / 2 + 1;
      } else {
        return settings.nodeWidth / 2;
      }
    }
    if (d.startX < d.endX) {
      if (d.endArrow) {
        return -1 * (settings.nodeWidth / 2 + 1);
      } else {
        return -1 * (settings.nodeWidth / 2);
      }
    }
  }

  function correctionStartY(d) {
    if (d.startY === d.endY) {
      return 0;
    }
    if (d.startY < d.endY) {
      if (d.startArrow) {
        return settings.nodeHeight / 2 + 1;
      } else {
        return settings.nodeHeight / 2;
      }
    }
    if (d.startY > d.endY) {
      if (d.startArrow) {
        return -1 * (settings.nodeHeight / 2 + 1);
      } else {
        return -1 * (settings.nodeHeight / 2);
      }
    }
  }
  function correctionEndY(d) {
    if (d.startY === d.endY) {
      return 0;
    }
    if (d.startY > d.endY) {
      if (d.endArrow) {
        return settings.nodeHeight / 2 + 1;
      } else {
        return settings.nodeHeight / 2;
      }
    }
    if (d.startY < d.endY) {
      if (d.endArrow) {
        return -1 * (settings.nodeHeight / 2 + 1);
      } else {
        return -1 * (settings.nodeHeight / 2);
      }
    }
  }


  // generating the links elements (the arrows)
  const links = mainGroup
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr(
      "x1",
      (d) => d.startX * settings.distanceHorizontal + correctionStartX(d)
    )
    .attr("x2", (d) => d.endX * settings.distanceHorizontal + correctionEndX(d))
    .attr(
      "y1",
      (d) => d.startY * settings.distanceVertical + correctionStartY(d)
    )
    .attr("y2", (d) => d.endY * settings.distanceVertical + correctionEndY(d))
    .style("stroke", settings.linkColor)
    .attr("marker-end", (d) => (d.endArrow ? "url(#arrowhead)" : ""))
    .attr("marker-start", (d) => (d.startArrow ? "url(#arrowhead)" : ""));

  // generating the nodes groups (groups holding the rectangles and labels wrapped by the links to the urls)
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

  // rectangles added to the nodes group
  nodes
    .append("rect")
    .attr("width", settings.nodeWidth)
    .attr("height", settings.nodeHeight)
    .style("fill", settings.rectangleColor)
    .attr("rx", settings.radius)
    .attr("ry", settings.radius)
    .attr("stroke", settings.rectangleBorderColor);

  // text added to the nodes group
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

// main function call
drawChart(settings, data);
