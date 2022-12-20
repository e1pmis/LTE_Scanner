let plt = require("nodeplotlib");

const data = [
    {
        x: [769, 806, 816],
        y: [-62, -62, -62],
        mode: "markers",
        type: "scatter",
    },
];

plt.plot(data);
