import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'

// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);

const datalabelFn = (value, name, image, delta) => {
  let percentage = (value.toFixed(2) / 435545430) * 100;
  if (percentage > 100) {
    percentage = 100;
  }

  percentage = Math.sqrt(percentage / 80.0) * 100.0;

  const imageWidth = percentage / 100 * 175;
  const imageHeight = percentage / 100 * 175;
  const nameFontSizeVw = percentage / 100 * 2;
  const deltaFontSizeVw = percentage / 100 * 3;

  const label = 
  `
  <div>
    <br>
    <img src=${image} width=${imageWidth} height=${imageHeight} style="display:block; margin-left:auto; margin-right:auto">
    <br>
    <div class='label', style="font-size: ${nameFontSizeVw}vw">
      ${name}
    </div>
    <br>
    <div class='label', style="font-size: ${deltaFontSizeVw}vw">
      ${delta}
    </div>
  </div>
  `
  return label;
}

const options = {
  title: {
    text: 'NFT Bubbles - powered by MagicEden',
    style: {
      color: '#FFFFFF',
    }
  },
  chart: {
    type: 'packedbubble',
    backgroundColor: '#222222',
  },
  tooltip: {
    enabled: false
  },
  legend: {
    enabled: false
  },
  exporting: {
    buttons: {
        contextButton: {
            enabled: false
        }    
    }
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    packedbubble: {
      minSize: 50,
      maxSize: 500,
      zMin: 0,
      zMax: 435545430.0,
      opacity: 0.8,
      layoutAlgorithm: {
        splitSeries: false,
        gravitationalConstant: 0.000,
      },
      dataLabels: {
        enabled: true,
        useHTML: true,
        align: 'center',
        varticalAlign: 'middle',
        formatter() {
          return datalabelFn(this.point.value, this.point.name, this.point.image, this.point.delta);
        }
      }
    },
    series: {
      states: {
        hover: {
          halo: null,
        }
      },
      marker: {
        lineWidth: 0,
      }
    },

  },
  series: [],
}

const generateOptions = (seriesData) => {
  options['series'] = seriesData;
  return options;
}

class BubbleChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seriesData: [],
      options: generateOptions([])
    }
  }

  componentDidMount() {
    fetch('https://json.extendsclass.com/bin/dae27b575a3a')
      .then(response => response.json())
      .then((jsonData) => {
        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i]['data'][0]['delta'].startsWith('-')) {
            jsonData[i]['data'][0]['marker'] = { symbol: 'url(red_circle.png)'};
          } else {
            jsonData[i]['data'][0]['marker'] = { symbol: 'url(green_circle.png)'};
          }
        }
        this.setState({ seriesData: jsonData, options: generateOptions(jsonData) });
      })
      .catch((error) => {
        console.error(error);
      })
  }

  render() {
    return (
      <HighchartsReact
        containerProps={{ style: { height: "100%" } }}
        highcharts={Highcharts}
        constructorType={'chart'}
        options={options}
      />
    )
  }
}

export default BubbleChart
