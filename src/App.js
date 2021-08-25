import React, {useState, useEffect} from 'react'
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';



const App = () => {
  function selectPointsByDrag(e) {


    // Select points
    Highcharts.each(this.series, function(series) {
      Highcharts.each(series.points, function(point) {
        if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
          point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max) {
          point.select(true, true);
          console.log(point.dataGroup);
          if (point.dataGroup && options.series.data) {
            console.log(
              'Group', options.series.data.slice(point.dataGroup.start, point.dataGroup.start + point.dataGroup.length)
            );

          }
        }
      });
    });

    // Fire a custom event


    return false; // Don't zoom
  }



  /**
   * On click, unselect all points
   */
  function unselectByClick() {
    var points = this.getSelectedPoints();
    if (points.length > 0) {
      Highcharts.each(points, function(point) {
        point.select(false);
      });
    }
  }

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
      text: 'AAPL Stock Price'
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
          click: function() {
            console.log('dataGroup', this.dataGroup);
            if (this.dataGroup && options.series.data) {
              console.log(
                'raw points', options.series.data.slice(this.dataGroup.start, this.dataGroup.start + this.dataGroup.length)
              );
            }
          }
        }
      }
    }]
  });

  useEffect(() => {
    fetch("https://demo-live-data.highcharts.com/aapl-c.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        setOptions({ series: [{ data: data }] });
      });
  }, []);

  return (
    <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
  />
  );
}

export default App;