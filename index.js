document.addEventListener("DOMContentLoaded", function() {
    // Get the <select> element
    var selectElement = document.getElementById('items');
  
    // Add event listener for 'change' event
    selectElement.addEventListener('change', async function() {
      // Get the selected option
      var selectedOption = selectElement.options[selectElement.selectedIndex];
      
      // Get the value and text of the selected option
      var selectedValue = selectedOption.value;
      var selectedText = selectedOption.text;

      // Load the dataset based on the selected text
      const data = await fetchData(selectedText);
      
      // Process the loaded data and generate the chart
      const { ohlc, volume } = processData(data);
      generateChart(ohlc, volume, selectedText);
    });
});

async function fetchData(selectedText) {
    const response = await fetch(`http://localhost:3003/${selectedText}`);
    return response.json();
}

function processData(data) {
    const data1 = data.reverse();
    const ohlc = [];
    const volume = [];
    const dataLength = data1.length;

    for (let i = 0; i < dataLength; i++) {
        ohlc.push([
            Date.parse(data1[i].Fecha), // the date
            data1[i].Apertura, // open
            data1[i].Máximo, // high
            data1[i].Mínimo, // low
            data1[i].Cierre // close
        ]);

        volume.push([
            Date.parse(data1[i].Fecha), // the date
            Number(data1[i]["Monto Negociado"]) // the volume
        ]);
    }

    return { ohlc, volume };
}

function generateChart(ohlc, volume, selectedText) {
    Highcharts.stockChart('container', {
        yAxis: [{
            labels: {
                align: 'left'
            },
            height: '80%',
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
        }],
        tooltip: {
            shape: 'square',
            headerShape: 'callout',
            borderWidth: 0,
            shadow: false,
            positioner: function (width, height, point) {
                const chart = this.chart;
                let position;

                if (point.isHeader) {
                    position = {
                        x: Math.max(
                            // Left side limit
                            chart.plotLeft,
                            Math.min(
                                point.plotX + chart.plotLeft - width / 2,
                                // Right side limit
                                chart.chartWidth - width - chart.marginRight
                            )
                        ),
                        y: point.plotY
                    };
                } else {
                    position = {
                        x: point.series.chart.plotLeft,
                        y: point.series.yAxis.top - chart.plotTop
                    };
                }

                return position;
            }
        },
        series: [{
            type: 'ohlc',
            id: 'aapl-ohlc',
            name: `${selectedText}`,
            data: ohlc
        }, {
            type: 'column',
            id: 'aapl-volume',
            name: `${selectedText}`,
            data: volume,
            yAxis: 1
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 800
                },
                chartOptions: {
                    rangeSelector: {
                        inputEnabled: false
                    }
                }
            }]
        }
    });
}

