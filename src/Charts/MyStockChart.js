import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const MyStockChart = ({options}) => {
    return <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
  />
}

export default MyStockChart;