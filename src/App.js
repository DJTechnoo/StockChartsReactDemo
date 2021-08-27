import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';



const App = () => {

  const [selectedData, setSelectedData] = useState([]);
  const [options, setOptions] = useState({

    chart: {
      width: 600,

      events: {
        selection: selectPointsByDrag,
        click: unselectByClick
      },
      zoomType: 'xy'
    },

    title: {
      text: 'Primary chart'
    },

    series: [{
      name: 'AAPL Stock Price',
      data: [],
      marker: {
        enabled: true
      },
      allowPointSelect: true,
      dataGrouping: {
        groupPixelWidth: 20
      },
      point: {
        events: {
          click: click
        }
      }
    }]
  });

  function selectPointsByDrag(e) {

    let series = this.series[0],
      selectedData = [],
      startIndex = -1,
      endIndex = 0;

    // Select points
    series.points.forEach((point) => {
      point.select(false, true);
      if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
        point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max) {
        point.select(true, true);

        if (point.dataGroup) {
          if (startIndex === -1) {
            startIndex = point.dataGroup.start;
            endIndex = startIndex;
          }
          endIndex += point.dataGroup.length;
          /* const xData = series.xData.slice(point.dataGroup.start, point.dataGroup.start + point.dataGroup.length);
           const yData = series.yData.slice(point.dataGroup.start, point.dataGroup.start + point.dataGroup.length);

           for (let i in xData) { // NOTE: Better to find starting and ending index of the entire data array.
             selectedData.push([xData[i], yData[i]]);
           }
           console.log(series.options.data);
           console.log(
           'GroupY', series.yData.slice(point.dataGroup.start, point.dataGroup.start + point.dataGroup.length),
           'GroupX', series.xData.slice(point.dataGroup.start, point.dataGroup.start + point.dataGroup.length)
           );*/
        }
      }
    });
    // Better way, (instead of the above)
    selectedData = series.options.data.slice(startIndex, endIndex);
    setSelectedData(selectedData);

    return false; // Don't zoom

  }



  /**
   * On click, unselect all points
   */
  function unselectByClick() {
    var points = this.getSelectedPoints();
    if (points.length > 0) {
      points.forEach((point) => {
        point.select(false);
      });
    }
  }

  function click() { // Select a single point
    if (this.dataGroup) {
      setSelectedData(this.series.options.data.slice(this.dataGroup.start, this.dataGroup.start + this.dataGroup.length));
    }
  }

  useEffect(() => {
    fetch("https://demo-live-data.highcharts.com/aapl-c.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        setOptions({
          series: [{ data: data }]
        });
      });
  }, []);


  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />

      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"chart"}
        options={{
          chart: {
            width: 600,
          },
          xAxis: {
            type: 'datetime'
          },
          title: {
            text: 'Secondary chart'
          },

          series: [{
            data: selectedData,
            marker: {
              enabled: true
            }
          }]
        }}
      />
    </div>
  );
}

export default App;